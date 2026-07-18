(() => {
  "use strict";

  const statusTitle = document.getElementById("status-title");
  const statusText = document.getElementById("status-text");
  const statusDot = document.getElementById("status-dot");
  const reloadButton = document.getElementById("reload-button");

  function showReady(message) {
    statusTitle.textContent = "GAMELAND آماده است";
    statusText.textContent = message;
    statusDot.classList.add("ready");
  }

  reloadButton.addEventListener("click", () => window.location.reload());

  if (!("serviceWorker" in navigator)) {
    showReady("برنامه آماده است؛ کش آفلاین در این مرورگر پشتیبانی نمی‌شود.");
    return;
  }

  window.addEventListener("load", async () => {
    try {
      await navigator.serviceWorker.register("./service-worker.js", { scope: "./" });
      await navigator.serviceWorker.ready;
      showReady(navigator.onLine ? "هسته برنامه برای استفاده آفلاین ذخیره شد." : "برنامه اکنون به‌صورت آفلاین اجرا می‌شود.");
    } catch (error) {
      statusTitle.textContent = "برنامه اجرا شد";
      statusText.textContent = "ذخیره آفلاین کامل نشد؛ برای تلاش دوباره، صفحه را بازنشانی کنید.";
    }
  });
})();
