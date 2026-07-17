(() => {
  'use strict';

  const $ = (id) => document.getElementById(id);

  const state = {
    online: navigator.onLine,
    progress: 0,
  };

  function setStatus(text) {
    const el = $('status-text');
    if (el) el.textContent = text;
  }

  function setBadge(text, online) {
    const el = $('network-badge');
    if (!el) return;
    el.textContent = text;
    el.classList.toggle('online', !!online);
    el.classList.toggle('offline', !online);
  }

  function setProgress(value) {
    const bar = $('progress-bar');
    if (!bar) return;
    bar.style.width = `${Math.max(0, Math.min(100, value))}%`;
  }

  function bootAnimation() {
    state.progress = 0;
    setProgress(0);

    const timer = setInterval(() => {
      state.progress += 8;
      setProgress(state.progress);

      if (state.progress >= 100) {
        clearInterval(timer);
        setStatus('سامانه آماده است.');
      } else if (state.progress < 30) {
        setStatus('در حال آماده‌سازی رابط...');
      } else if (state.progress < 70) {
        setStatus('در حال بررسی منابع محلی...');
      } else {
        setStatus('در حال نهایی‌سازی...');
      }
    }, 120);
  }

  function updateNetwork() {
    const online = navigator.onLine;
    state.online = online;

    if (online) {
      setBadge('آنلاین', true);
      setStatus('اتصال برقرار است. PWA آماده استفاده است.');
    } else {
      setBadge('آفلاین', false);
      setStatus('حالت آفلاین فعال است. داده‌ها از کش خوانده می‌شوند.');
    }
  }

  function registerServiceWorker() {
    if (!('serviceWorker' in navigator)) return;

    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./service-worker.js', { scope: './' })
        .then((reg) => {
          console.log('[GAMELAND] SW registered:', reg.scope);
        })
        .catch((err) => {
          console.error('[GAMELAND] SW registration failed:', err);
        });
    });
  }

  function bindEvents() {
    window.addEventListener('online', updateNetwork);
    window.addEventListener('offline', updateNetwork);

    const checkBtn = $('check-button');
    if (checkBtn) {
      checkBtn.addEventListener('click', () => {
        updateNetwork();
        bootAnimation();
      });
    }

    const restartBtn = $('restart-button');
    if (restartBtn) {
      restartBtn.addEventListener('click', () => {
        window.location.reload();
      });
    }
  }

  function init() {
    updateNetwork();
    bindEvents();
    registerServiceWorker();
    bootAnimation();
    console.log('[GAMELAND] PWA loaded');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
