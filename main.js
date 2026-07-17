(function () {
  var badge = document.getElementById('network-badge');
  var installBadge = document.getElementById('install-badge');
  var statusText = document.getElementById('status-text');
  var progressBar = document.getElementById('progress-bar');
  var checkButton = document.getElementById('check-button');
  var restartButton = document.getElementById('restart-button');
  var goldenMessage = document.getElementById('golden-message');

  function setProgress(value) {
    progressBar.style.width = value + '%';
  }

  function setNetworkStatus() {
    var online = navigator.onLine;
    badge.textContent = online ? 'آنلاین' : 'آفلاین';
    badge.className = 'badge ' + (online ? 'online' : 'offline');
  }

  function setGoldenMessage(text, active) {
    goldenMessage.textContent = text;
    goldenMessage.classList.toggle('show', !!active);
  }

  function showInstalledState() {
    installBadge.textContent = 'نصب شد';
    installBadge.className = 'badge golden';
    statusText.textContent = 'حافظه آفلاین فعال است و برنامه آماده استفاده می‌باشد.';
    setProgress(100);
    setGoldenMessage('پیغام طلایی: کش آفلاین با موفقیت نصب و فعال شد.', true);
  }

  async function checkOfflineReady() {
    setProgress(25);
    statusText.textContent = 'در حال بررسی حافظه آفلاین...';
    setGoldenMessage('در حال بررسی وضعیت نصب آفلاین...', false);

    if (!('serviceWorker' in navigator) || !('caches' in window)) {
      installBadge.textContent = 'پشتیبانی نشد';
      installBadge.className = 'badge muted';
      statusText.textContent = 'این مرورگر از Service Worker یا Cache Storage پشتیبانی نمی‌کند.';
      setProgress(0);
      return;
    }

    try {
      var cache = await caches.open('gameland-shell-v1');
      var keys = await cache.keys();
      var ready = keys.length > 0;

      if (ready) {
        showInstalledState();
      } else {
        installBadge.textContent = 'نصب نشده';
        installBadge.className = 'badge muted';
        statusText.textContent = 'کش هنوز آماده نیست؛ یک بار صفحه را تازه‌سازی کنید.';
        setProgress(60);
        setGoldenMessage('پیغام طلایی هنوز فعال نشده؛ نصب آفلاین کامل نیست.', false);
      }
    } catch (error) {
      installBadge.textContent = 'خطا';
      installBadge.className = 'badge muted';
      statusText.textContent = 'بررسی حافظه آفلاین با خطا مواجه شد.';
      setProgress(0);
    }
  }

  async function registerServiceWorker() {
    if (!('serviceWorker' in navigator)) {
      statusText.textContent = 'مرورگر از Service Worker پشتیبانی نمی‌کند.';
      return;
    }

    try {
      setProgress(10);
      await navigator.serviceWorker.register('./service-worker.js', { scope: './' });
      statusText.textContent = 'Service Worker ثبت شد؛ در حال آماده‌سازی کش آفلاین...';
      setProgress(55);

      navigator.serviceWorker.addEventListener('controllerchange', function () {
        checkOfflineReady();
      });

      setTimeout(checkOfflineReady, 800);
    } catch (error) {
      installBadge.textContent = 'ناموفق';
      installBadge.className = 'badge muted';
      statusText.textContent = 'ثبت حالت آفلاین ناموفق بود؛ سایت باید از HTTPS یا localhost باز شود.';
      setProgress(0);
    }
  }

  window.addEventListener('online', setNetworkStatus);
  window.addEventListener('offline', setNetworkStatus);

  checkButton.addEventListener('click', checkOfflineReady);
  restartButton.addEventListener('click', function () {
    setNetworkStatus();
    checkOfflineReady();
  });

  window.addEventListener('beforeinstallprompt', function (event) {
    event.preventDefault();
    installBadge.textContent = 'قابل نصب';
    installBadge.className = 'badge golden';
    setGoldenMessage('پیغام طلایی: برنامه قابل نصب است.', true);
  });

  window.addEventListener('appinstalled', function () {
    showInstalledState();
  });

  setNetworkStatus();
  registerServiceWorker();
})();
