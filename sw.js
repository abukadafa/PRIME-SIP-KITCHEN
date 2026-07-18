const CACHE_NAME = 'psk-cache-v1';
const ASSETS = [
  './',
  './index.html',
  './menu.html',
  './cart.html',
  './about.html',
  './contact.html',
  './dashboard.html',
  './css/style.css',
  './js/app.js',
  './manifest.json',
  './assets/soft_life_combo.png',
  './assets/lamb_shank_platter.png',
  './assets/prime_sip_special.png',
  './assets/icon-192.png',
  './assets/icon-512.png'
];

// Install event - caching assets
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate event - cleaning old caches
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - cache-first strategy with network fallback
self.addEventListener('fetch', (e) => {
  // Skip caching external video URL streams to prevent large media cache issues
  if (e.request.url.includes('mixkit.co')) {
    return;
  }
  
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(e.request).then((networkResponse) => {
        // Cache new successful requests dynamically if matching local origin
        if (networkResponse && networkResponse.status === 200 && e.request.url.startsWith(self.location.origin)) {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(e.request, networkResponse.clone());
            return networkResponse;
          });
        }
        return networkResponse;
      });
    }).catch(() => {
      // Offline fallback can be defined here if necessary
    })
  );
});
