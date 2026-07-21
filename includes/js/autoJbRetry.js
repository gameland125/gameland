(function () {
    var autoJailbreakStarted = false;

    window.autoJailbreak = function () {
        if (autoJailbreakStarted) {
            return;
        }

        if (typeof window.jailbreak !== "function") {
            console.log("GAMELAND: jailbreak() is not ready");
            return;
        }

        autoJailbreakStarted = true;
        console.log("GAMELAND: Starting automatic jailbreak");

        window.jailbreak();
    };

    window.runJailbreakAfterCache = function () {
        var shouldRun;

        shouldRun =
            sessionStorage.getItem(
                "run_jailbreak_after_cache"
            ) === "1";

        if (!shouldRun) {
            return;
        }

        /*
         * علامت را قبل از اجرا پاک می‌کنیم تا با reload صفحه،
         * jailbreak دوباره و هم‌زمان اجرا نشود.
         */
        sessionStorage.removeItem(
            "run_jailbreak_after_cache"
        );

        waitForJailbreakRequirements(0);
    };

    function waitForJailbreakRequirements(attempt) {
        var payloadPath;
        var firmwareReady;
        var platformReady;
        var jailbreakReady;

        /*
         * حداکثر 50 مرتبه، هر بار با فاصله 200 میلی‌ثانیه:
         * در مجموع حدود 10 ثانیه.
         */
        if (attempt >= 50) {
            alert(
                "اجرای خودکار GoldHEN انجام نشد.\n" +
                "Firmware یا فایل‌های jailbreak آماده نیستند."
            );
            return;
        }

        /*
         * اگر payload_path هنوز تنظیم نشده، GoldHEN را
         * به‌صورت پیش‌فرض انتخاب می‌کنیم.
         */
        payloadPath = sessionStorage.getItem("payload_path");

        if (!payloadPath) {
            payloadPath =
                "./includes/payloads/GoldHEN/" +
                "goldhen_v2.4b18.10.bin";

            sessionStorage.setItem(
                "payload_path",
                payloadPath
            );
        }

        jailbreakReady =
            typeof window.jailbreak === "function";

        platformReady =
            typeof window.user !== "undefined" &&
            Boolean(window.user.platform);

        firmwareReady =
            typeof window.user !== "undefined" &&
            Boolean(window.user.ps4Fw);

        if (
            jailbreakReady &&
            platformReady &&
            firmwareReady &&
            payloadPath
        ) {
            window.autoJailbreak();
            return;
        }

        setTimeout(function () {
            waitForJailbreakRequirements(attempt + 1);
        }, 200);
    }
}());
