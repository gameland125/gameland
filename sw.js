const CACHE_NAME = "ps4-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/auto.html",
  "/offline.html",
  "/loader.js",
  "/payloads/goldhen.bin"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
