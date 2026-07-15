// Auto-Trigger logic
window.onload = async () => {
    try {
        const status = document.getElementById('status');
        // فراخوانی متد اکسپلویت
        await runExploit(); 
        status.innerText = "GoldHEN فعال شد.";
        // بازگشت به منوی بازی (شبیه‌سازی شده)
        setTimeout(() => window.location.href = "about:blank", 2000);
    } catch (e) {
        document.getElementById('status').innerText = "خطا: " + e.message;
        document.getElementById('restart-btn').style.display = "block";
    }
};

// ساده‌سازی اجرای payload از پوشه hen
async function runExploit() {
    // منطق تزریق HEN اینجا قرار می‌گیرد
}
