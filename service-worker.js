// House of Mastery service worker
// Provides offline resilience for the assessment instruments.
// Strategy: cache-first for the HTML shell, network-first for everything else.

const VERSION = 'hom-v3.0.0';
const CORE = [
  '/',
  '/first-hour.html',
  '/index.html',
  '/privacy.html',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(VERSION).then((cache) => cache.addAll(CORE)).then(() => self.skipWaiting())
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

  // Bypass for EmailJS API and any cross-origin POSTs
  if (url.origin !== self.location.origin) {
    event.respondWith(
      fetch(req).catch(() => new Response('Offline', { status: 503 }))
    );
    return;
  }

  // HTML pages: network-first, fall back to cache
  if (req.mode === 'navigate' || req.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(VERSION).then((cache) => cache.put(req, copy));
        return res;
      }).catch(() => caches.match(req).then((cached) => cached || caches.match('/first-hour.html')))
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
