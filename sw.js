self.addEventListener('install', e => {
  e.waitUntil(
    caches.open('ps4-cache').then(cache => {
      return cache.addAll([
        '/',
        '/index.html',
        '/auto.html',
        '/offline.html',
        '/payloads/goldhen.bin'
      ]);
    })
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request))
  );
});
