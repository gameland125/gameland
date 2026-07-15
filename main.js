const statusEl = document.getElementById('status');
const restartBtn = document.getElementById('restartBtn');

function setStatus(msg) {
  statusEl.textContent = msg;
}

function showRestart() {
  restartBtn.classList.remove('hidden');
}

restartBtn.addEventListener('click', () => {
  location.reload();
});

async function boot() {
  try {
    setStatus('در حال بارگذاری...');
    
    if ('serviceWorker' in navigator) {
      try {
        await navigator.serviceWorker.register('./service-worker.js');
      } catch (e) {}
    }

    setStatus('آماده اجرا.');

    // اگر بعداً فایل/منطق خاصی در /hen گذاشتی،
    // اینجا می‌توانی لود یا فراخوانی‌اش کنی.

  } catch (err) {
    setStatus('خطا در اجرا: ' + err.message);
    showRestart();
  }
}

window.addEventListener('load', boot);
