// Gameland PWA Service Worker - Optimized Version
const CACHE_NAME = 'gameland-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './style.css',
  './main.js',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png'
];

// نصب سرویس ورکر و کش کردن فایل‌ها
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // استفاده از map برای اینکه اگر یک فایل خطا داد، بقیه کش شوند
      return Promise.allSettled(
        ASSETS_TO_CACHE.map((url) => {
          return cache.add(url).catch((err) => {
            console.warn(`فایل در لیست کش پیدا نشد: ${url}`);
          });
        })
      );
    })
  );
  self.skipWaiting();
});

// فعال‌سازی و حذف کش‌های قدیمی
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// استراتژی Cache-First: اول از حافظه، اگر نبود از شبکه
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).catch(() => {
        // اگر آفلاین بود و فایل پیدا نشد، صفحه اصلی را نشان بده
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
