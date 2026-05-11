// House of Mastery service worker
// Provides offline resilience for the assessment instruments.
// Strategy: cache-first for the HTML shell, network-first for everything else.

const VERSION = 'hom-v3.7.55';
const CORE = [
  '/',
  '/first-hour',
  '/index.html',
  '/about.html',
  '/about',
  '/koora-faq.html',
  '/koora-faq',
  '/first-hour-faq.html',
  '/first-hour-faq',
  '/privacy.html',
  '/privacy',
  '/shared.js',
  '/feature-flags.js',
  '/observability.js',
  '/manifest.json',
  '/images/koora-finishers-protocol-dr-job-mogire-house-of-mastery-kenya.png',
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
      }).catch(() => caches.match(req).then((cached) => cached || caches.match('/first-hour/')))
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
