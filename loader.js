function load_goldhen() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'goldhen.bin', true);
    xhr.responseType = 'arraybuffer';

    xhr.onload = function() {
        var payload = new Uint8Array(xhr.response);
        runPayload(payload);
    };

    xhr.send();
}

// اجرا خودکار
setTimeout(load_goldhen, 3000);
