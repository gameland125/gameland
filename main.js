/**
 * GAMELAND - PWA Control Script
 * Operator: Qassem Akbarzadeh
 * Location: Kashmar, Darabi 15
 * -----------------------------------------
 */

// 1. ثبت Service Worker (فعال شده)
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./service-worker.js')
            .then(() => console.log('Service Worker Registered Successfully'))
            .catch((err) => console.error('Service Worker Registration Failed:', err));
    }
}

// 2. هندل کردن دکمه راه اندازی مجدد
function setupRestartButton() {
    const restartBtn = document.getElementById('restart-button');
    if (restartBtn) {
        restartBtn.addEventListener('click', () => {
            window.location.reload();
        });
    }
}

// 3. منطق اجرای خودکار GoldHEN
async function runAutoExploit() {
    try {
        console.log("Gameland: Starting Auto-Exploit...");
        
        // فرض بر این است که تابع اصلی اجرای HEN در HENs.js تعریف شده است (مثلاً loadGoldHEN)
        // اگر نام تابع متفاوت است، آن را با نام واقعی در پروژه خود جایگزین کنید
        await loadGoldHEN(); 

        // در صورت موفقیت:
        console.log("Exploit Success!");
        window.location.href = 'about:blank'; // ریدایرکت به صفحه خالی طبق دستور

    } catch (error) {
        console.error("Exploit Error:", error);
        
        // مدیریت خطا (نمایش ۲ هشدار)
        alert("Alert 1: Exploitation process encountered an error.");
        alert("Alert 2: System exploit failed to initialize. Please check your connection.");
        
        // اطمینان از نمایش دکمه ریستارت در صورت خرابی
        const restartBtn = document.getElementById('restart-button');
        if (restartBtn) restartBtn.style.display = 'block';
    }
}

// مقداردهی اولیه
document.addEventListener('DOMContentLoaded', () => {
    registerServiceWorker();
    setupRestartButton();
    
    // اجرای خودکار (Auto-trigger)
    // کمی تاخیر برای اطمینان از بارگذاری کامل اسکریپت‌ها
    setTimeout(runAutoExploit, 2000);
});
