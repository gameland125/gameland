/**
 * Gameland Service Worker
 * Strategy: Cache-First, Network Fallback
 */

const CACHE_NAME = 'gameland-shell-v1';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './main.js',
    './style.css',
    './manifest.webmanifest',
    './includes/js/index.js', // در صورت وجود فایل‌های اضافی در پوشه includes
    './includes/css/layouts/index.css'
];

// نصب و کش کردن فایل‌ها
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
    self.skipWaiting();
});

// فعال‌سازی و پاکسازی کش‌های قدیمی
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

// استراتژی پاسخ‌دهی: اول کش، اگر نبود شبکه
self.addEventListener('fetch', (event) => {
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request).catch(() => {
                return caches.match('./index.html');
            })
        );
        return;
    }

    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request).catch(() => {
                // اگر فایل در کش نبود و اینترنت هم قطع بود، تلاش برای یافتن در کش
                return caches.match('./index.html');
            });
        })
    );
});
