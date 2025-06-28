// Service Worker with Cache Strategies
const CACHE_NAME = 'winning-wizards-v2';
const OFFLINE_URL = '/offline.html';
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/images/social-preview.jpg',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Install Event - Pre-cache critical resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
    .then(cache => {
      console.log('Opened cache');
      return cache.addAll(PRECACHE_URLS);
    })
    .then(() => self.skipWaiting())
  );
});

// Activate Event - Clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('Deleting old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event - Network with Cache Fallback
self.addEventListener('fetch', event => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;
  
  // Handle navigation requests
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
      .catch(() => caches.match(OFFLINE_URL))
    );
    return;
  }
  
  // For all other requests
  event.respondWith(
    caches.match(event.request)
    .then(cached => {
      // Return cached response if found
      if (cached) return cached;
      
      // Otherwise fetch from network
      return fetch(event.request)
        .then(response => {
          // Check if valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          // Clone and cache the response
          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then(cache => cache.put(event.request, responseToCache));
          
          return response;
        })
        .catch(err => {
          console.error('Fetch failed:', err);
        });
    })
  );
});

// Background Sync (if needed)
self.addEventListener('sync', event => {
  if (event.tag === 'submitForm') {
    event.waitUntil(handleBackgroundSync());
  }
});

// Push Notifications (if needed)
self.addEventListener('push', event => {
  const data = event.data.json();
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/icons/icon-192x192.png'
    })
  );
});
