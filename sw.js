/* ============================================================
   Vivaha — Premium Indian Matrimony PWA
   Service Worker (Cache-First Strategy)
   ============================================================ */

const CACHE_NAME = 'vivaha-v1';
const STATIC_CACHE = 'vivaha-static-v1';
const DYNAMIC_CACHE = 'vivaha-dynamic-v1';
const IMAGE_CACHE = 'vivaha-images-v1';

// Assets to cache immediately (App Shell)
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/css/styles.css',
  '/js/app.js',
  '/icons/favicon.svg',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

// Maximum items in dynamic cache
const MAX_DYNAMIC_ITEMS = 50;
const MAX_IMAGE_ITEMS = 100;

// ============================================================
// Install Event - Cache App Shell
// ============================================================
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[SW] Caching app shell');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// ============================================================
// Activate Event - Clean Old Caches
// ============================================================
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => {
        return Promise.all(
          keys
            .filter((key) => key !== STATIC_CACHE && key !== DYNAMIC_CACHE && key !== IMAGE_CACHE)
            .map((key) => caches.delete(key))
        );
      })
      .then(() => self.clients.claim())
  );
});

// ============================================================
// Fetch Event - Cache Strategies
// ============================================================
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip cross-origin requests (except for allowed CDNs)
  if (url.origin !== location.origin && !url.hostname.includes('fonts.googleapis.com') && !url.hostname.includes('fonts.gstatic.com')) {
    return;
  }

  // Strategy based on request type
  if (isStaticAsset(request)) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
  } else if (isImageRequest(request)) {
    event.respondWith(cacheFirst(request, IMAGE_CACHE));
  } else if (isAPIRequest(request)) {
    event.respondWith(networkFirst(request, DYNAMIC_CACHE));
  } else if (isNavigationRequest(request)) {
    event.respondWith(staleWhileRevalidate(request, STATIC_CACHE));
  } else {
    event.respondWith(staleWhileRevalidate(request, DYNAMIC_CACHE));
  }
});

// ============================================================
// Cache Strategies
// ============================================================

// Cache First - For static assets and images
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    // Return offline fallback for navigation requests
    if (request.mode === 'navigate') {
      return caches.match('/index.html');
    }
    throw error;
  }
}

// Network First - For API requests
async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);

  try {
    const response = await fetch(request);
    if (response.ok) {
      // Limit cache size
      await limitCacheSize(cache, MAX_DYNAMIC_ITEMS);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await cache.match(request);
    if (cached) {
      return cached;
    }
    // Return offline page for navigation
    if (request.mode === 'navigate') {
      return caches.match('/index.html');
    }
    throw error;
  }
}

// Stale While Revalidate - For HTML pages
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  const fetchPromise = fetch(request).then((response) => {
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  }).catch(() => cached);

  return cached || fetchPromise;
}

// ============================================================
// Helper Functions
// ============================================================

function isStaticAsset(request) {
  const url = new URL(request.url);
  return url.pathname.match(/\.(css|js|woff2?|ttf|eot|svg|ico|webmanifest)$/);
}

function isImageRequest(request) {
  return request.destination === 'image' || request.headers.get('accept')?.includes('image');
}

function isAPIRequest(request) {
  const url = new URL(request.url);
  return url.pathname.startsWith('/api/');
}

function isNavigationRequest(request) {
  return request.mode === 'navigate';
}

async function limitCacheSize(cache, maxItems) {
  const keys = await cache.keys();
  if (keys.length > maxItems) {
    await cache.delete(keys[0]);
    return limitCacheSize(cache, maxItems);
  }
}

// ============================================================
// Background Sync (for offline form submissions)
// ============================================================
self.addEventListener('sync', (event) => {
  if (event.tag === 'contact-form') {
    event.waitUntil(syncContactForm());
  }
});

async function syncContactForm() {
  // In production, retrieve from IndexedDB and submit
  console.log('[SW] Syncing offline forms...');
}

// ============================================================
// Push Notifications (Future Enhancement)
// ============================================================
self.addEventListener('push', (event) => {
  if (!event.data) return;

  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/icons/icon-192.png',
    badge: '/icons/badge-72.png',
    vibrate: [100, 50, 100],
    data: { url: data.url || '/' },
    actions: [
      { action: 'open', title: 'Open' },
      { action: 'dismiss', title: 'Dismiss' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'open') {
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then((clientList) => {
        for (const client of clientList) {
          if (client.url === event.notification.data.url && 'focus' in client) {
            return client.focus();
          }
        }
        return clients.openWindow(event.notification.data.url);
      })
    );
  }
});

// ============================================================
// Message Handling (from main thread)
// ============================================================
self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }

  if (event.data === 'getCacheSize') {
    getCacheSize().then(size => {
      event.ports[0].postMessage({ size });
    });
  }
});

async function getCacheSize() {
  const cacheNames = await caches.keys();
  let totalSize = 0;
  for (const name of cacheNames) {
    const cache = await caches.open(name);
    const keys = await cache.keys();
    for (const request of keys) {
      const response = await cache.match(request);
      if (response) {
        const blob = await response.blob();
        totalSize += blob.size;
      }
    }
  }
  return totalSize;
}

// ============================================================
// Periodic Background Sync (Future Enhancement)
// ============================================================
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'refresh-profiles') {
    event.waitUntil(refreshProfilesCache());
  }
});

async function refreshProfilesCache() {
  // In production, fetch latest profiles and update cache
  console.log('[SW] Refreshing profiles cache...');
}

// ============================================================
// Error Handling
// ============================================================
self.addEventListener('error', (event) => {
  console.error('[SW] Error:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
  console.error('[SW] Unhandled rejection:', event.reason);
});

console.log('[SW] Vivaha Service Worker loaded');