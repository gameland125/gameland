// main.js - Gameland PWA

(() => {
  'use strict';

  const SW_URL = './service-worker.js';

  function log(...args) {
    console.log('[Gameland]', ...args);
  }

  function registerServiceWorker() {
    if (!('serviceWorker' in navigator)) {
      log('Service Worker not supported');
      return;
    }

    window.addEventListener('load', async () => {
      try {
        const reg = await navigator.serviceWorker.register(SW_URL, {
          scope: './',
        });
        log('Service Worker registered:', reg.scope);
      } catch (err) {
        console.error('[Gameland] Service Worker registration failed:', err);
      }
    });
  }

  function setAppMeta() {
    document.documentElement.lang = document.documentElement.lang || 'fa';
    document.title = document.title || 'GAMELAND';

    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) metaTheme.setAttribute('content', '#777777');
  }

  function init() {
    setAppMeta();
    registerServiceWorker();
    log('PWA loaded');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
