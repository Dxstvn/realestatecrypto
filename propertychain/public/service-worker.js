/**
 * Service Worker - PropertyChain PWA
 * 
 * Offline support and caching strategy for mobile experience
 * Following UpdatedUIPlan.md Step 49 specifications
 */

const CACHE_NAME = 'propertychain-v1.0.0';
const RUNTIME_CACHE = 'propertychain-runtime';
const IMAGE_CACHE = 'propertychain-images';
const API_CACHE = 'propertychain-api';

// Assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/offline',
  '/manifest.json',
  '/favicon.ico',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/fonts/inter-var.woff2',
];

// API endpoints to cache
const API_ROUTES = [
  '/api/properties',
  '/api/user/profile',
  '/api/market/metrics',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Install');
  
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ServiceWorker] Caching static assets');
      return cache.addAll(STATIC_ASSETS);
    }).then(() => {
      // Skip waiting to activate immediately
      return self.skipWaiting();
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activate');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && 
              cacheName !== RUNTIME_CACHE && 
              cacheName !== IMAGE_CACHE &&
              cacheName !== API_CACHE) {
            console.log('[ServiceWorker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Take control of all clients immediately
      return self.clients.claim();
    })
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Handle API requests - Network First with Cache Fallback
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      networkFirstStrategy(request, API_CACHE, 5 * 60 * 1000) // 5 minutes TTL
    );
    return;
  }

  // Handle image requests - Cache First with Network Fallback
  if (request.destination === 'image' || 
      /\.(jpg|jpeg|png|gif|webp|svg|ico)$/i.test(url.pathname)) {
    event.respondWith(
      cacheFirstStrategy(request, IMAGE_CACHE)
    );
    return;
  }

  // Handle navigation requests - Network First with Offline Page
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => {
        return caches.match('/offline');
      })
    );
    return;
  }

  // Default strategy - Stale While Revalidate
  event.respondWith(
    staleWhileRevalidate(request, RUNTIME_CACHE)
  );
});

// Network First Strategy
async function networkFirstStrategy(request, cacheName, ttl) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      
      // Clone the response before caching
      const responseToCache = networkResponse.clone();
      
      // Add timestamp to track TTL
      const headers = new Headers(responseToCache.headers);
      headers.append('sw-fetched-on', new Date().getTime());
      
      const timedResponse = new Response(responseToCache.body, {
        status: responseToCache.status,
        statusText: responseToCache.statusText,
        headers: headers
      });
      
      cache.put(request, timedResponse);
    }
    
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      // Check if cached response is still valid
      const fetchedOn = cachedResponse.headers.get('sw-fetched-on');
      
      if (fetchedOn && (Date.now() - fetchedOn) < ttl) {
        return cachedResponse;
      }
    }
    
    // Return offline fallback for failed API requests
    return new Response(
      JSON.stringify({ 
        error: 'Offline', 
        message: 'Data not available offline' 
      }),
      {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Cache First Strategy
async function cacheFirstStrategy(request, cacheName) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    // Update cache in background
    fetch(request).then((networkResponse) => {
      if (networkResponse.ok) {
        caches.open(cacheName).then((cache) => {
          cache.put(request, networkResponse);
        });
      }
    });
    
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Return placeholder image for failed image requests
    return caches.match('/images/placeholder.png');
  }
}

// Stale While Revalidate Strategy
async function staleWhileRevalidate(request, cacheName) {
  const cachedResponse = await caches.match(request);
  
  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      caches.open(cacheName).then((cache) => {
        cache.put(request, networkResponse.clone());
      });
    }
    return networkResponse;
  }).catch(() => cachedResponse);
  
  return cachedResponse || fetchPromise;
}

// Background Sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('[ServiceWorker] Background sync', event.tag);
  
  if (event.tag === 'sync-properties') {
    event.waitUntil(syncProperties());
  } else if (event.tag === 'sync-messages') {
    event.waitUntil(syncMessages());
  }
});

// Sync properties data
async function syncProperties() {
  try {
    const response = await fetch('/api/properties/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        lastSync: await getLastSyncTime('properties')
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      await updateLastSyncTime('properties');
      
      // Notify clients of successful sync
      self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
          client.postMessage({
            type: 'SYNC_COMPLETE',
            data: 'properties'
          });
        });
      });
    }
  } catch (error) {
    console.error('[ServiceWorker] Sync failed:', error);
  }
}

// Sync messages
async function syncMessages() {
  // Similar implementation for messages
  console.log('[ServiceWorker] Syncing messages...');
}

// Push notifications
self.addEventListener('push', (event) => {
  console.log('[ServiceWorker] Push received');
  
  let data = {};
  
  if (event.data) {
    data = event.data.json();
  }
  
  const options = {
    title: data.title || 'PropertyChain',
    body: data.body || 'You have a new notification',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [200, 100, 200],
    tag: data.tag || 'default',
    requireInteraction: data.requireInteraction || false,
    data: {
      url: data.url || '/',
      ...data
    },
    actions: data.actions || [
      {
        action: 'view',
        title: 'View',
        icon: '/icons/check.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
        icon: '/icons/cross.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification(options.title, options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  console.log('[ServiceWorker] Notification clicked');
  
  event.notification.close();
  
  if (event.action === 'dismiss') {
    return;
  }
  
  const urlToOpen = event.notification.data.url || '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((windowClients) => {
      // Check if there's already a window/tab open
      for (const client of windowClients) {
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      
      // Open new window if not found
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

// Message handler for client communication
self.addEventListener('message', (event) => {
  console.log('[ServiceWorker] Message received:', event.data);
  
  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  } else if (event.data.type === 'CLEAR_CACHE') {
    clearAllCaches().then(() => {
      event.ports[0].postMessage({ success: true });
    });
  } else if (event.data.type === 'CACHE_URLS') {
    cacheUrls(event.data.urls).then(() => {
      event.ports[0].postMessage({ success: true });
    });
  }
});

// Helper functions
async function getLastSyncTime(key) {
  // In production, use IndexedDB
  return localStorage.getItem(`lastSync_${key}`) || 0;
}

async function updateLastSyncTime(key) {
  // In production, use IndexedDB
  localStorage.setItem(`lastSync_${key}`, Date.now());
}

async function clearAllCaches() {
  const cacheNames = await caches.keys();
  await Promise.all(
    cacheNames.map(cacheName => caches.delete(cacheName))
  );
}

async function cacheUrls(urls) {
  const cache = await caches.open(RUNTIME_CACHE);
  await cache.addAll(urls);
}

// Performance monitoring
self.addEventListener('fetch', (event) => {
  const startTime = performance.now();
  
  event.waitUntil(
    event.respondWith.then(() => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // Log slow requests
      if (duration > 1000) {
        console.warn('[ServiceWorker] Slow request:', event.request.url, duration + 'ms');
      }
    })
  );
});

console.log('[ServiceWorker] Loaded');