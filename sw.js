/* lot-calculator-web — 最小キャッシュ（オフライン時にシェル表示） */
const CACHE = 'tra-lot-calc-v2';
const PRECACHE_URLS = ['index.html', 'setup.html', 'manifest.webmanifest', 'icon.svg'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) =>
      Promise.all(
        PRECACHE_URLS.map((path) => {
          const url = new URL(path, self.location).href;
          return cache.add(url).catch(() => {});
        })
      )
    )
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((res) => {
        const copy = res.clone();
        if (res.ok && url.pathname.endsWith('index.html')) {
          caches.open(CACHE).then((c) => c.put(event.request, copy));
        }
        return res;
      });
    })
  );
});
