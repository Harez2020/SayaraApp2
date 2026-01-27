const CACHE_NAME = 'sayara-app-v11';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './services.js',
  './slider.js',
  './translations.js',
  './Navigation.js',
  './PWA.js',
  './services.json',
  './style.css',
  './mobile.css',
  './img/CardlogoPlaceHolder.svg',
  './img/phone.svg',
  './img/sayaralogo192.png',
  './img/sayaralogo512.png',
  '../Supplier/index.html',
  '../Supplier/suppliers.json',
  '../Supplier/suppliers.js',
  '../Supplier/img/nissan.png',
  '../Supplier/img/toyota.png',
  '../Supplier/img/kia.png',
  '../Supplier/img/chevrolet.png',
  '../Supplier/img/ford.png',
  '../Supplier/img/mercedes.png',
  '../Supplier/img/jeep.png',
  '../Supplier/img/car-parts.png',
  '../Supplier/img/car-repairs.png',
  '../Supplier/img/iraq.png',
  '../Form/index.html',
  '../AboutUs/index.html',
  '../SocialMedia/index.html',
  '../Share/index.html',
  '../ContactUs/index.html',
  '../termandprivacy/terms.html',
  '../termandprivacy/privacy.html',
  '../termandprivacy/script.js',
  '../termandprivacy/content.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener('fetch', (event) => {
  // HTML pages: Network First, fall back to cache
  if (event.request.mode === 'navigate' || event.request.headers.get('accept').includes('text/html')) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        })
        .catch(() => {
          return caches.match(event.request).then((cachedResponse) => {
             // Fallback to offline.html if you had one, or just the cached index
             return cachedResponse || caches.match('./index.html');
          });
        })
    );
  } else {
    // Static assets: Stale-While-Revalidate
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          return caches.open(CACHE_NAME).then((cache) => {
             cache.put(event.request, networkResponse.clone());
             return networkResponse;
          });
        });
        return cachedResponse || fetchPromise;
      })
    );
  }
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
