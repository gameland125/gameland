function load_goldhen(){
    var req = new XMLHttpRequest();
    req.open('GET', 'goldhen.bin');
    req.responseType = "arraybuffer";

    req.onload = function() {
        if (req.status === 200) {
            var payload = new Uint8Array(req.response);
            console.log("GoldHEN loaded, size:", payload.length);

            // fake trigger (placeholder)
            alert("GoldHEN Loaded Successfully!");
        } else {
            alert("Failed to load goldhen.bin");
        }
    };

    req.send();
}
