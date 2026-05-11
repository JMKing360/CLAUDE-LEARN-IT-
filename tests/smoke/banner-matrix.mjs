import fs from 'fs';
import path from 'path';
import { JSDOM, ResourceLoader } from '/tmp/node_modules/jsdom/lib/api.js';
const REPO = '/home/user/CLAUDE-LEARN-IT-';
class L extends ResourceLoader {
  fetch(url) {
    try { const u = new URL(url); if (u.pathname.endsWith('.js')) { const p = path.join(REPO, u.pathname.replace(/^\//, '')); if (fs.existsSync(p)) return Promise.resolve(fs.readFileSync(p)); } } catch (_e) {}
    return Promise.resolve(Buffer.from(''));
  }
}
async function test(label, hostname, withConfig) {
  const events = { errors: [] };
  const dom = await JSDOM.fromFile(path.join(REPO, 'index.html'), {
    url: `https://${hostname}/`, runScripts: 'dangerously', resources: new L(), pretendToBeVisual: true,
    beforeParse(w) {
      w.fbq = () => {}; w.fbq.queue = [];
      if (withConfig) w.HOM_CONFIG = { ghlWebhookUrl: 'https://services.leadconnectorhq.com/hooks/x/y' };
      w.fetch = () => Promise.resolve({ ok: false, json: () => Promise.resolve({}) });
      w.console.error = (...a) => events.errors.push(a.join(' '));
    }
  });
  await new Promise(r => dom.window.addEventListener('DOMContentLoaded', () => setTimeout(r, 200)));
  await new Promise(r => setTimeout(r, 200));
  const banner = !!dom.window.document.querySelector('.hom-ops-banner');
  console.log(`${label.padEnd(60)} banner=${banner} errors=${events.errors.length}`);
  dom.window.close();
}
await test('prod (hom.mogire.com) WITH config → banner suppressed', 'hom.mogire.com', true);
await test('prod (hom.mogire.com) WITHOUT config → banner suppressed', 'hom.mogire.com', false);
await test('preview (abc.pages.dev) WITH config → banner suppressed', 'abc.pages.dev', true);
await test('preview (abc.pages.dev) WITHOUT config → banner SHOULD render', 'abc.pages.dev', false);
await test('localhost WITHOUT config → banner SHOULD render', 'localhost', false);
