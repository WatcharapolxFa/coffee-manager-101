const CACHE_NAME = 'coffee-manager-v3';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/app.js',
  '/js/i18n.js',
  '/js/config.js',
  '/js/utils.js',
  '/js/storage.js',
  '/js/calculator.js',
  '/js/components/charts.js',
  '/js/views/dashboard.js',
  '/js/views/menus.js',
  '/js/views/sales.js',
  '/js/views/report.js',
  '/js/views/overhead.js',
  '/js/views/purchases.js',
  '/assets/grab-logo.svg',
  '/assets/lineman-logo.svg',
  '/assets/shop-logo.svg',
  '/manifest.json'
];

const CDN_ASSETS = [
  'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js',
  'https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;600;700&display=swap'
];

// Install: pre-cache all static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[SW] Pre-caching static assets');
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate: delete old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => {
          console.log('[SW] Deleting old cache:', k);
          return caches.delete(k);
        })
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch: Cache First for static assets, Network First for CDN
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle GET requests
  if (request.method !== 'GET') return;

  const isCDN = CDN_ASSETS.some(cdn => request.url.startsWith(cdn));
  const isStatic = STATIC_ASSETS.includes(url.pathname) ||
    url.hostname === self.location.hostname;

  if (isCDN) {
    // Network First for CDN assets
    event.respondWith(
      fetch(request)
        .then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
          return response;
        })
        .catch(() => caches.match(request))
    );
  } else if (isStatic) {
    // Cache First for local static assets
    event.respondWith(
      caches.match(request).then(cached => {
        if (cached) return cached;
        return fetch(request).then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
          return response;
        });
      })
    );
  }
});
