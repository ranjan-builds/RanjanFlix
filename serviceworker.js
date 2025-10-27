// Name of the cache
const CACHE_NAME = 'reactflix-cache-v1';

// Files to cache
const URLS_TO_CACHE = [
  '/',
  '/reactflix/',
  '/index.html',
  '/styles.css',
  '/app.js',
  './icon-192.png',
  './icon-512.png',
  './1.jpg',
  './2.jpg',
  './3.jpg',
];

// Install event to cache resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(URLS_TO_CACHE);
    })
  );
});

// Activate event to clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event to serve cached resources or fetch from network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) {
        return response; // Return cached resource
      }
      return fetch(event.request).then(networkResponse => {
        // Cache the network response for future requests
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      }).catch(() => {
        // Optionally handle offline scenario here (e.g., serve a fallback)
        return caches.match('./offline.html');
      });
    })
  );
});
