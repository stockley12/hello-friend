// La'Couronne Service Worker - PWA Support for Android & iOS
const CACHE_NAME = 'lacouronne-v2';
const OFFLINE_URL = './offline.html';

// Files to cache for offline use
const STATIC_CACHE = [
  './',
  './index.html',
  './offline.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './home-hero-bg.png',
  './book-hero-bg.png',
  './logo.png'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;
  
  // Skip chrome-extension and other non-http requests
  if (!event.request.url.startsWith('http')) return;
  
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          // Return cached version
          return cachedResponse;
        }
        
        // Try network
        return fetch(event.request)
          .then((networkResponse) => {
            // Don't cache non-successful responses
            if (!networkResponse || networkResponse.status !== 200) {
              return networkResponse;
            }
            
            // Clone and cache the response
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                // Only cache same-origin requests
                if (event.request.url.startsWith(self.location.origin)) {
                  cache.put(event.request, responseToCache);
                }
              });
            
            return networkResponse;
          })
          .catch(() => {
            // Network failed, return offline page for navigation requests
            if (event.request.mode === 'navigate') {
              return caches.match(OFFLINE_URL);
            }
            return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
          });
      })
  );
});

// Handle push notifications (for future use)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body || 'New notification',
      icon: './icons/icon-192.png',
      badge: './icons/icon-72.png',
      vibrate: [200, 100, 200],
      data: data.url || './',
      actions: [
        { action: 'open', title: 'Open' },
        { action: 'close', title: 'Close' }
      ]
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title || "La'Couronne", options)
    );
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'close') return;
  
  event.waitUntil(
    clients.openWindow(event.notification.data || './')
  );
});

console.log('[SW] Service Worker loaded');
