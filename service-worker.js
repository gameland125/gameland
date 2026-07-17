if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./service-worker.js').catch(() => {});
}

// ادامه اجرای هاست
startHost();
