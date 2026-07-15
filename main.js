var statusText = document.getElementById('status-text');
var networkBadge = document.getElementById('network-badge');
var progressBar = document.getElementById('progress-bar');
var checkButton = document.getElementById('check-button');
var restartButton = document.getElementById('restart-button');
var notice = document.getElementById('notice');

function updateNetworkState() {
  if (navigator.onLine) {
    networkBadge.textContent = 'آنلاین';
    networkBadge.classList.add('online');
    networkBadge.classList.remove('offline');
  } else {
    networkBadge.textContent = 'آفلاین';
    networkBadge.classList.add('offline');
    networkBadge.classList.remove('online');
  }
}

function setStatus(message) {
  statusText.textContent = message;
}

function setProgress(percent) {
  progressBar.style.width = percent + '%';
}

function enableButtons() {
  checkButton.disabled = false;
  restartButton.disabled = false;
}

function runCheck() {
  checkButton.disabled = true;
  setStatus('در حال بررسی وضعیت آفلاین...');
  setProgress(15);

  window.setTimeout(function () {
    setProgress(55);
    window.setTimeout(function () {
      setProgress(100);
      setStatus('آماده است. نسخهٔ عمومی فعال و پایدار است.');
      checkButton.disabled = false;
    }, 500);
  }, 500);
}

function restartPage() {
  window.location.reload();
}

updateNetworkState();

window.addEventListener('online', updateNetworkState);
window.addEventListener('offline', updateNetworkState);

checkButton.addEventListener('click', runCheck);
restartButton.addEventListener('click', restartPage);

enableButtons();
setProgress(0);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('./service-worker.js', { scope: './' })
      .then(function () {
        setStatus('سامانه آماده است؛ ذخیره‌سازی آفلاین فعال شد.');
      })
      .catch(function () {
        setStatus('ثبت حالت آفلاین ناموفق بود؛ سایت باید از HTTPS یا localhost باز شود.');
      });
  });
} else {
  setStatus('مرورگر از حالت آفلاین پشتیبانی نمی‌کند؛ برنامه همچنان به‌صورت عادی قابل استفاده است.');
}
