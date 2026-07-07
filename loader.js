async function loadPayload(path) {
    let response = await fetch(path);
    let arrayBuffer = await response.arrayBuffer();
    let payload = new Uint8Array(arrayBuffer);

    console.log("Payload Loaded:", path);

    // اجرای payload (وابسته به exploit)
    window.postMessage({
        type: "load_payload",
        payload: payload
    }, "*");
}
