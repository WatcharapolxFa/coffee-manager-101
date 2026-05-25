const CACHE_NAME = 'coffee-manager-v4';

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.add('./'))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  const isNav = event.request.mode === 'navigate';
  if (isNav) {
    event.respondWith(
      fetch(event.request)
        .then(res => {
          if (res.ok) caches.open(CACHE_NAME).then(c => c.put(event.request, res.clone()));
          return res;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) {
        fetch(event.request).then(res => {
          if (res.ok) caches.open(CACHE_NAME).then(c => c.put(event.request, res.clone()));
        }).catch(() => {});
        return cached;
      }
      return fetch(event.request).then(res => {
        if (res.ok) caches.open(CACHE_NAME).then(c => c.put(event.request, res.clone()));
        return res;
      });
    })
  );
});
