// La'Couronne Service Worker v3 - Minimal, cache-last strategy for reliability
const CACHE_NAME = 'lacouronne-v3';
const OFFLINE_URL = './offline.html';

// Only cache truly static assets
const STATIC_CACHE = [
  './offline.html',
  './icons/icon-192.png',
  './icons/icon-512.png',
];

// Install - skip waiting immediately
self.addEventListener('install', () => {
  console.log('[SW] Installing v3...');
  self.skipWaiting();
});

// Activate - claim clients and clear old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating v3...');
  event.waitUntil(
    Promise.all([
      // Clear ALL old caches to prevent stale content
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((name) => {
            console.log('[SW] Deleting cache:', name);
            return caches.delete(name);
          })
        );
      }),
      // Claim all clients
      self.clients.claim(),
    ])
  );
});

// Fetch - ALWAYS network first, only use cache for offline fallback
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;
  
  // Skip non-http requests
  if (!event.request.url.startsWith('http')) return;
  
  // For navigation requests (HTML pages), always go to network
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => caches.match(OFFLINE_URL))
    );
    return;
  }
  
  // For all other requests, network first with no caching
  // This prevents stale JS/CSS from causing blank screens
  event.respondWith(fetch(event.request));
});

console.log('[SW] Service Worker v3 loaded - Network First');
