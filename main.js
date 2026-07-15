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

    async function runGoldHEN() {
      setStatus('در حال بارگذاری GoldHEN...');
      // در اینجا باید کد مربوط به اجرای payload از پوشه hen/ را اضافه کنیم.
      // این قسمت به نحوه پیاده‌سازی اکسپلویت در پروژه شما بستگی دارد.
      // به عنوان مثال، ممکن است نیاز به فراخوانی توابع خاصی از کتابخانه‌هایی
      // که در نسخه‌های قبلی وجود داشت (مثل HENs.js یا psfree.mjs) باشد.

      // **مهم:** این قسمت نیاز به کدنویسی دقیق دارد.
      // مثال ساده (نیاز به تکمیل دارد):
      try {
        // فرض کنید یک تابع loadAndRunPayload داریم که فایل bin را اجرا می‌کند
        await loadAndRunPayload('/hen/goldhen_v2.4b18.10.bin'); 
        setStatus('GoldHEN فعال شد!');
        // به صورت اختیاری، بعد از چند ثانیه به صفحه خالی هدایت شو
        setTimeout(() => window.location.href = "about:blank", 3000); 
      } catch (error) {
        console.error("Error running GoldHEN:", error);
        setStatus('خطا در اجرای GoldHEN.');
        showRestart();
      }
    }

    // تابع کمکی فرضی برای بارگذاری و اجرای payload
    async function loadAndRunPayload(url) {
      // این تابع باید منطق واقعی بارگذاری فایل .bin و ارسال آن به کنسول را پیاده‌سازی کند.
      // این بخش ممکن است پیچیده باشد و نیاز به توابع کمکی برای ارتباط با کنسول داشته باشد.
      // در حال حاضر فقط یک شبیه‌سازی ساده انجام می‌دهیم:
      await new Promise(resolve => setTimeout(resolve, 2000)); // شبیه‌سازی بارگذاری
      console.log(`Payload loaded from ${url} (simulated)`);
      // در عمل، باید از WebAssembly یا کدهای دیگر برای ارسال payload استفاده کرد.
    }

    async function boot() {
      setStatus('آماده‌سازی...');
      
      // رجیستر کردن Service Worker برای کش آفلاین
      if ('serviceWorker' in navigator) {
        try {
          await navigator.serviceWorker.register('./service-worker.js');
          console.log('Service Worker registered.');
        } catch (error) {
          console.error('Service Worker registration failed:', error);
        }
      } else {
        console.log('Service Worker not supported.');
      }

      // --- شروع اجرای GoldHEN ---
      await runGoldHEN();
    }

    window.addEventListener('load', boot);
