// OpenLifeOS Service Worker v1.0.0
// Enables offline support and faster loading

const CACHE_NAME = 'openlifeos-v1.0.0';
const RUNTIME_CACHE = 'openlifeos-runtime';

// Core files to cache for offline use
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/mit/index.html',
  '/assets/logo/openlifeos-logo-dark.svg',
  '/assets/logo/openlifeos-icon.svg',
  '/components/secure-api-manager.js',
  '/components/api-key-manager-fixed.js',
  '/demos/life-os-ultimate-v2.html',
  '/demos/presentation-final.html',
  '/demos/AUGHACKS_MIT_2025_PRESENTATION_V2.html',
  '/demos/quantum-interface.html',
  '/demos/life-os-complete.html',
  '/demos/biometric-dashboard.html',
  '/demos/futuristic-gui.html',
  '/demos/jarvis-assistant.html'
];

// Install event - cache core files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[ServiceWorker] Pre-caching core files');
        return cache.addAll(PRECACHE_URLS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(cacheName => {
            return cacheName.startsWith('openlifeos-') && cacheName !== CACHE_NAME;
          })
          .map(cacheName => {
            console.log('[ServiceWorker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache when possible
self.addEventListener('fetch', event => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Cache-first strategy for assets
  if (event.request.url.includes('/assets/') || 
      event.request.url.includes('/demos/') ||
      event.request.url.endsWith('.css') ||
      event.request.url.endsWith('.js')) {
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          if (response) {
            return response;
          }
          return fetch(event.request).then(response => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            // Clone the response
            const responseToCache = response.clone();
            caches.open(RUNTIME_CACHE)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            return response;
          });
        })
    );
    return;
  }

  // Network-first strategy for HTML pages
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return caches.match(event.request)
            .then(response => {
              if (response) {
                return response;
              }
              // Return offline page if available
              return caches.match('/index.html');
            });
        })
    );
    return;
  }

  // Default: network with cache fallback
  event.respondWith(
    fetch(event.request)
      .catch(() => {
        return caches.match(event.request);
      })
  );
});

// Background sync for offline actions
self.addEventListener('sync', event => {
  if (event.tag === 'sync-demo-data') {
    event.waitUntil(syncDemoData());
  }
});

// Push notifications (future feature)
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : 'New update from OpenLifeOS',
    icon: '/assets/logo/openlifeos-icon.svg',
    badge: '/assets/logo/openlifeos-icon.svg',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };

  event.waitUntil(
    self.registration.showNotification('OpenLifeOS', options)
  );
});

// Helper function for background sync
async function syncDemoData() {
  try {
    // Placeholder for future sync functionality
    console.log('[ServiceWorker] Background sync completed');
  } catch (error) {
    console.error('[ServiceWorker] Background sync failed:', error);
  }
}