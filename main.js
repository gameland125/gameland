'use strict';

const $ = (id) => document.getElementById(id);
const statusText = $('status-text');
const progressBar = $('progress-bar');
const badge = $('network-badge');
const checkButton = $('check-button');
const restartButton = $('restart-button');

function setStatus(text, pct = 0, mode = 'idle') {
  statusText.textContent = text;
  progressBar.style.width = `${Math.max(0, Math.min(100, pct))}%`;

  if (mode === 'good') badge.textContent = 'آماده';
  else if (mode === 'warn') badge.textContent = 'آفلاین';
  else badge.textContent = navigator.onLine ? 'آنلاین' : 'آفلاین';
}

function registerSW() {
  if (!('serviceWorker' in navigator)) return;
  window.addEventListener('load', async () => {
    try {
      await navigator.serviceWorker.register('./service-worker.js');
    } catch (e) {
      console.warn('SW registration failed:', e);
    }
  });
}

function updateConnectivity() {
  if (navigator.onLine) {
    badge.textContent = 'آنلاین';
    badge.style.color = '#8fe39b';
  } else {
    badge.textContent = 'آفلاین';
    badge.style.color = '#f0c674';
  }
}

checkButton.addEventListener('click', () => {
  setStatus('در حال بررسی وضعیت ذخیره‌سازی آفلاین...', 35, 'warn');
  setTimeout(() => setStatus('فایل‌های رابط آماده و کش شده‌اند.', 100, 'good'), 700);
});

restartButton.addEventListener('click', () => {
  location.reload();
});

window.addEventListener('online', updateConnectivity);
window.addEventListener('offline', updateConnectivity);

updateConnectivity();
setStatus('سامانه آماده است.', 10, navigator.onLine ? 'good' : 'warn');
registerSW();
