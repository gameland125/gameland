function loadPayload() {
    alert("Loading GoldHEN...");

    fetch("payloads/goldhen.bin")
    .then(res => res.arrayBuffer())
    .then(data => {
        alert("Payload Loaded (Fake Mode)");
        // اینجا در نسخه واقعی باید به binloader ارسال بشه
    });
}
