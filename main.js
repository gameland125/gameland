/**
 * Gameland Main Logic
 * Operator: Qassem Akbarzadeh
 */

const APP_CONFIG = {
    cacheName: 'gameland-shell-v1',
    retryLimit: 3
};

let retryCount = 0;

// گارد برای اطمینان از وجود المان‌ها در DOM
const getElement = (id) => document.getElementById(id);

const updateStatusUI = (isOnline, message) => {
    const statusEl = getElement('connection-status');
    if (!statusEl) return;

    statusEl.textContent = message;
    statusEl.className = isOnline ? 'status-online' : 'status-offline';
};

// مدیریت ثبت Service Worker
async function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        try {
            const registration = await navigator.serviceWorker.register('service-worker.js');
            console.log('Service Worker registered:', registration.scope);
        } catch (error) {
            console.error('Service Worker registration failed:', error);
        }
    }
}

// مدیریت وضعیت آنلاین و آفلاین
function handleConnectivityChange() {
    if (navigator.onLine) {
        updateStatusUI(true, 'وضعیت: آنلاین');
    } else {
        updateStatusUI(false, 'وضعیت: آفلاین (در حال استفاده از حالت کش)');
    }
}

// تابع اصلی شروع به کار برنامه
async function initApp() {
    // ۱. ثبت Service Worker
    await registerServiceWorker();

    // ۲. مدیریت رویدادهای اتصال
    window.addEventListener('online', handleConnectivityChange);
    window.addEventListener('offline', handleConnectivityChange);
    
    // چک کردن وضعیت اولیه
    handleConnectivityChange();

    console.log('Gameland Initialized');
}

// شروع برنامه وقتی DOM آماده شد
document.addEventListener('DOMContentLoaded', initApp);
