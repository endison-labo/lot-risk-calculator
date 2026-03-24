/* lot-calculator-web — HTML はネットワーク優先（常に最新を優先）、オフライン時のみキャッシュ */
const CACHE = 'tra-lot-calc-v4';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
      )
      .then(() => caches.open(CACHE))
      .then((cache) =>
        cache.addAll(
          ['index.html', 'setup.html', 'manifest.webmanifest', 'icon.svg'].map(
            (p) => new URL(p, self.location).href
          )
        )
      )
      .catch(() => {})
      .then(() => self.clients.claim())
  );
});

function isHtmlNavigation(request, url) {
  if (request.mode === 'navigate') return true;
  const dest = request.destination;
  if (dest === 'document') return true;
  if (url.pathname.endsWith('.html')) return true;
  const accept = request.headers.get('accept') || '';
  return accept.includes('text/html');
}

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  if (isHtmlNavigation(event.request, url)) {
    event.respondWith(
      fetch(event.request)
        .then((res) => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(event.request, copy));
          }
          return res;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((res) => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(event.request, copy));
        }
        return res;
      });
    })
  );
});
