self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open('ps4-host').then(function(cache) {
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
