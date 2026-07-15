'use strict';

var CACHE_NAME = 'gameland-shell-v2';

var APP_SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './service-worker.js',

  // Core UI
  './style.css',
  './main.js',

  // Icons
  './icon-192.png',
  './icon-512.png',

  // PSFree / app dependencies
  './PSFree.manifest',
  './includes/css/layouts/index.css',
  './includes/js/HENs.js',
  './includes/js/autoJbRetry.js',
  './includes/js/checkFw.js',
  './includes/js/design.js',
  './includes/js/events.js',
  './includes/js/index.js',
  './includes/js/index-legacy.js',
  './includes/js/language.js',
  './includes/js/payloadsList.js',
  './includes/payloads/payloads.js',
  './src/alert.mjs',
  './src/config.mjs',
  './src/lapse.mjs',
  './src/psfree.mjs',
  './src/send.mjs',
  './src/lapse/ps4/900.mjs',
  './src/lapse/ps4/903.mjs',
  './src/module/chain.mjs',
  './src/module/int64.mjs',
  './src/module/mem.mjs',
  './src/module/memtools.mjs',
  './src/module/offset.mjs',
  './src/module/rw.mjs',
  './src/module/utils.mjs',
  './src/module/view.mjs',
  './src/rop/ps4/900.mjs'
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(APP_SHELL);
    }).then(function () {
      return self.skipWaiting();
    })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.map(function (key) {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      );
    }).then(function () {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', function (event) {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(function (cached) {
      if (cached) return cached;

      return fetch(event.request).then(function (response) {
        if (
          !response ||
          response.status !== 200 ||
          response.type === 'opaque'
        ) {
          return response;
        }

        var copy = response.clone();
        caches.open(CACHE_NAME).then(function (cache) {
          cache.put(event.request, copy);
        });

        return response;
      }).catch(function () {
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
        return new Response('', {
          status: 503,
          statusText: 'Offline'
        });
      });
    })
  );
});
