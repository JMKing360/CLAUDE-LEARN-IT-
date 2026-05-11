// Cold-load smoke test for the two HOM apps.
// Goal: verify HOM_TRACK queue stub captures calls, observability.js drain
// is correct, ViewContent fires, banner doesn't appear in "prod", and no
// uncaught JS exceptions occur during the welcome-screen render path.

import fs from 'fs';
import path from 'path';
import { JSDOM, ResourceLoader } from '/tmp/node_modules/jsdom/lib/api.js';

const REPO = '/home/user/CLAUDE-LEARN-IT-';

// Custom loader: serve local files; stub remote scripts as empty so the page
// doesn't fail to load Pixel/Sentry/Plausible/jsPDF in the sandbox.
class LocalLoader extends ResourceLoader {
  fetch(url, opts) {
    // Map hom.mogire.com or any test hostname back to the local repo so
    // /observability.js etc. resolve from disk.
    try {
      const u = new URL(url);
      // Anything that looks like our app under test resolves to the repo.
      if (u.pathname && (u.pathname.endsWith('.js') || u.pathname === '/observability.js' || u.pathname === '/shared.js' || u.pathname === '/feature-flags.js')) {
        const local = path.join(REPO, u.pathname.replace(/^\//, ''));
        if (fs.existsSync(local)) return Promise.resolve(fs.readFileSync(local));
      }
    } catch (_e) {}
    // Stub everything else (Pixel script, Sentry CDN, Plausible, jsPDF, etc.)
    return Promise.resolve(Buffer.from(''));
  }
}

async function testApp(label, htmlRelPath, prodHostname) {
  const events = { tracks: [], pixels: [], sentry: [], errors: [], warns: [] };
  const htmlPath = path.join(REPO, htmlRelPath);
  const html = fs.readFileSync(htmlPath, 'utf8');

  // Build a base URL that simulates the hostname. We use a hostname-aware test
  // so the banner-prod guard can be exercised.
  const url = `https://${prodHostname}/`;

  // Stub HOM_CONFIG with realistic values so EMAIL_OK passes and the banner
  // does not fire even on a non-prod hostname.
  const beforeScripts = `
    window.HOM_CONFIG = {
      ghlWebhookUrl: 'https://services.leadconnectorhq.com/hooks/test/abc',
      plausibleDomain: 'hom.mogire.com',
      sentryDsn: 'https://abc@xyz.ingest.sentry.io/123',
      release: 'hom@test',
      environment: 'test'
    };
    // Stub fbq before any script touches it.
    window.fbq = function(){
      __spy.pixels.push(Array.from(arguments));
    };
    window.fbq.queue = [];
    window.__spy = ${JSON.stringify(events)};
  `;

  const dom = await JSDOM.fromFile(htmlPath, {
    url,
    runScripts: 'dangerously',
    resources: new LocalLoader(),
    pretendToBeVisual: true,
    beforeParse(window) {
      // Inject the stubs and a console spy BEFORE the page's inline scripts run.
      window.__spy = events;
      // Stub fetch so feature-flags.js doesn't crash trying to hit a remote.
      window.fetch = () => Promise.resolve({ ok: false, status: 0, json: () => Promise.resolve({}) });
      window.fbq = function () { events.pixels.push(Array.from(arguments)); };
      window.fbq.queue = [];
      window.HOM_CONFIG = {
        ghlWebhookUrl: 'https://services.leadconnectorhq.com/hooks/test/abc',
        plausibleDomain: 'hom.mogire.com',
        sentryDsn: 'https://abc@xyz.ingest.sentry.io/123',
        release: 'hom@test',
        environment: 'test'
      };
      const origErr = window.console.error;
      window.console.error = (...a) => { events.errors.push(a.map(String).join(' ')); };
      window.console.warn = (...a) => { events.warns.push(a.map(String).join(' ')); };
      window.addEventListener('error', (e) => { events.errors.push('[error event] ' + (e.message || e)); });
      window.onunhandledrejection = (e) => { events.errors.push('[unhandled rejection] ' + (e.reason || e)); };
    }
  });

  // Wait for DOMContentLoaded + a tick for any deferred drains.
  await new Promise(res => {
    dom.window.addEventListener('DOMContentLoaded', () => setTimeout(res, 100));
  });
  // Also drain any 0-ms setTimeouts from the IO arm + 750ms fallback.
  await new Promise(r => setTimeout(r, 850));

  const win = dom.window;

  // Snapshot the queue stub state
  const queue = win.HOM_TRACK_QUEUE;
  const stubFnSig = typeof win.HOM_TRACK === 'function' ? win.HOM_TRACK.toString().slice(0, 80) : 'N/A';
  // Banner check
  const bannerVisible = !!win.document.querySelector('.hom-ops-banner');
  // Welcome screen check
  const welcomeActive = !!win.document.querySelector('#screen-welcome.active');
  // Pixel ID present
  const hasInit = events.pixels.some(p => p[0] === 'init' && p[1] === '748998691952331');
  const pageViewFired = events.pixels.some(p => p[0] === 'track' && p[1] === 'PageView');
  const viewContentFired = events.pixels.some(p => p[0] === 'track' && p[1] === 'ViewContent');

  console.log(`\n========== ${label} ==========`);
  console.log(`Hostname under test: ${prodHostname}`);
  console.log(`HOM_TRACK type: ${typeof win.HOM_TRACK}; queue length: ${queue ? queue.length : 'n/a (drained)'}`);
  console.log(`HOM_TRACK stub signature (first 80): ${stubFnSig}`);
  console.log(`HOM_SENTRY_WARN type: ${typeof win.HOM_SENTRY_WARN}`);
  console.log(`HOM_PIXEL_ADVANCED_MATCH type: ${typeof win.HOM_PIXEL_ADVANCED_MATCH}`);
  console.log(`HOM_LAST_EVENT_ID type: ${typeof win.HOM_LAST_EVENT_ID}`);
  console.log(`HOM_FIRE_VIEWCONTENT type: ${typeof win.HOM_FIRE_VIEWCONTENT}`);
  console.log(`HOM_PIXEL_DISABLED: ${win.HOM_PIXEL_DISABLED}`);
  console.log(`Welcome screen active: ${welcomeActive}`);
  console.log(`Operator banner visible (should be false on prod hostname): ${bannerVisible}`);
  console.log(`fbq('init', PIXEL) fired: ${hasInit}`);
  console.log(`fbq('track', 'PageView') fired: ${pageViewFired}`);
  console.log(`fbq('track', 'ViewContent') fired: ${viewContentFired}`);
  console.log(`Pixel call count: ${events.pixels.length}`);
  console.log(`HOM_TRACK queue contents:`);
  if (queue) queue.forEach((c, i) => console.log(`  [${i}] ${c[0]} ${JSON.stringify(c[1] || {})}`));
  console.log(`Console errors during load: ${events.errors.length}`);
  events.errors.slice(0, 12).forEach(e => console.log(`  ERR: ${e}`));
  console.log(`Console warnings: ${events.warns.length}`);
  events.warns.slice(0, 6).forEach(w => console.log(`  WARN: ${w}`));

  dom.window.close();
  return { label, events, queue, bannerVisible, welcomeActive, hasInit, pageViewFired, viewContentFired };
}

(async () => {
  // KOORA on prod hostname (banner must NOT show)
  await testApp('KOORA cold-load (hom.mogire.com)', 'index.html', 'hom.mogire.com');
  // First Hour on prod hostname
  await testApp('First Hour cold-load (hom.mogire.com)', 'first-hour/index.html', 'hom.mogire.com');
  // First Hour on preview hostname (banner SHOULD show if HOM_CONFIG missing — but we provided it, so banner suppressed)
  await testApp('First Hour preview-host with valid config', 'first-hour/index.html', 'preview-abc.pages.dev');
})();
