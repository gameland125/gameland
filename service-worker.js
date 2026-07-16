/* Gameland Service Worker
 * Cache-first, minimal, offline-ready
 */
'use strict';

const CACHE_NAME = 'gameland-shell-v1';

const APP_SHELL = [
  './',
  './index.html',
  './style.css',
  './main.js',
  './manifest.webmanifest'
];

// Install: cache app shell
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)).then(() => self.skipWaiting())
  );
});

// Activate: cleanup old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch: cache-first strategy
self.addEventListener('fetch', event => {
  const req = event.request;

  // Only handle GET requests
  if (req.method !== 'GET') return;

  event.respondWith(
    caches.match(req).then(cached => {
      if (cached) return cached;

      return fetch(req)
        .then(response => {
          // Cache successful same-origin responses
          const responseClone = response.clone();
          if (response && response.status === 200 && response.type === 'basic') {
            caches.open(CACHE_NAME).then(cache => cache.put(req, responseClone));
          }
          return response;
        })
        .catch(() => {
          // Fallback to app shell for navigation requests
          if (req.mode === 'navigate') {
            return caches.match('./index.html');
          }
          return new Response('', { status: 504, statusText: 'Offline' });
        });
    })
  );
});
