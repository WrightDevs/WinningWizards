// Import Firebase scripts for service worker
importScripts('https://www.gstatic.com/firebasejs/11.10.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/11.10.0/firebase-messaging-compat.js');

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBSwS_hzplY0cM3zXM8Y3JwOIoFtfwLmc",
  authDomain: "winning-wizards.firebaseapp.com",
  projectId: "winning-wizards",
  storageBucket: "winning-wizards.firebasestorage.app",
  messagingSenderId: "637648917005",
  appId: "1:637648917005:web:3eefda37fbd235d8f07b44",
  measurementId: "G-6QQRRBP6HL"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[Service Worker] Received background message:', payload);
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icons/icon-192x192.png',
    data: payload.data || {}
  };
  
  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url || '/')
  );
});

// Cache configuration
const CACHE_NAME = 'winning-wizards-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/sw.js', // Changed from firebase-messaging-sw.js to sw.js
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/manifest.json'
];

// Install event - cache essential assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
    .then((cache) => cache.addAll(ASSETS_TO_CACHE))
    .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - network with cache fallback
self.addEventListener('fetch', (event) => {
  // Skip Firebase-related and external requests
  if (event.request.url.includes('firebase') ||
    event.request.url.includes('googleapis') ||
    event.request.url.includes('gstatic') ||
    !event.request.url.startsWith(self.location.origin)) {
    return fetch(event.request);
  }
  
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Return cached response if found
      if (cachedResponse) {
        return cachedResponse;
      }
      
      // Otherwise fetch from network
      return fetch(event.request).then((response) => {
        // Only cache successful, same-origin responses
        if (response.ok && response.type === 'basic') {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      }).catch(() => {
        // Return offline page for HTML requests
        if (event.request.headers.get('accept').includes('text/html')) {
          return caches.match('/offline.html');
        }
      });
    })
  );
});
