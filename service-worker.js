// House of Mastery service worker
// Provides offline resilience for the assessment instruments.
// Strategy: cache-first for the HTML shell, network-first for everything else.

const VERSION = 'hom-v3.7.69';
// Static assets only. HTML routes are NOT precached because the edge
// middleware strips the Pixel for EEA / GPC visitors at request time —
// precaching the Pixel-bearing HTML at install would re-serve it later
// to a now-GPC browser whose middleware would have stripped it. HTML is
// fetched at runtime via the network-first handler below; the offline
// fallback is the cache populated by that handler, not the install step.
const CORE = [
  '/shared.js',
  '/feature-flags.js',
  '/observability.js',
  '/manifest.json',
  '/images/koora-finishers-protocol-dr-job-mogire-house-of-mastery-kenya.png',
  '/images/koora-wordmark-navy.png',
  '/images/koora-wordmark-white.png',
  '/images/House-of-Mastery-with-Dr-Job-Mogire-favicon.png',
  '/images/House-of-Mastery-with-Dr-Job-Mogire-logo.png',
  '/images/House-of-Mastery-icon-192.png',
  '/images/House-of-Mastery-icon-512.png',
  '/images/House-of-Mastery-icon-maskable-512.png',
  '/images/dr-job-mogire-md-facc-facp-physician-mindset-coach-house-of-mastery-kenya.jpg',
  '/images/dr-job-mogire-public-speaker-motivational-coach-house-of-mastery-east-africa.jpg',
  '/images/dr-job-mogire-emotional-intelligence-coach-house-of-mastery-nairobi-kenya.jpg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(VERSION).then((cache) =>
      Promise.all(
        // Use console.warn (not null-swallow) so a regressed route surfaces in
        // DevTools the first time SW installs after a deploy.
        CORE.map((url) => cache.add(url).catch((e) => {
          try { console.warn('[SW] cache.add failed for', url, e && e.message); } catch (_e) {}
          return null;
        }))
      )
    ).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Bypass for the GoHighLevel inbound webhook and any cross-origin POSTs
  if (url.origin !== self.location.origin) {
    event.respondWith(
      fetch(req).catch(() => new Response('Offline', { status: 503 }))
    );
    return;
  }

  // HTML pages: network-first, fall back to cache. Do NOT write the response
  // to cache when the server says Vary by CF-IPCountry or Sec-GPC - that
  // response is country/GPC-specific and would lie to a future visitor whose
  // country/GPC posture differs. Use the cache only as an offline fallback.
  if (req.mode === 'navigate' || req.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(req).then((res) => {
        const vary = res.headers.get('vary') || '';
        const isCountrySpecific = /cf-ipcountry|sec-gpc/i.test(vary);
        if (!isCountrySpecific) {
          const copy = res.clone();
          caches.open(VERSION).then((cache) => cache.put(req, copy));
        }
        return res;
      }).catch(() => caches.match(req).then((cached) => {
        if (cached) return cached;
        // Offline + nothing in cache for this URL: try a few siblings the
        // network-first handler may have populated on prior visits, then a
        // last-resort plain-text fallback. Avoid 'undefined' Response.
        return caches.match('/').then((root) => root
          || caches.match('/first-hour').then((fh) => fh
          || caches.match('/index.html').then((idx) => idx
          || new Response('You are offline. Reconnect and reload.', {
              status: 503,
              headers: { 'Content-Type': 'text/plain; charset=utf-8' }
            }))));
      }))
    );
    return;
  }

  // Other same-origin assets: cache-first
  event.respondWith(
    caches.match(req).then((cached) => cached || fetch(req).then((res) => {
      const copy = res.clone();
      caches.open(VERSION).then((cache) => cache.put(req, copy));
      return res;
    }))
  );
});
