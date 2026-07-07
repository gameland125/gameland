function loadPayload(path){
    var xhr = new XMLHttpRequest();
    xhr.open('GET', path, true);
    xhr.responseType = "arraybuffer";

    xhr.onload = function(){
        if(this.status === 200){
            var payload = new Uint8Array(this.response);
            sendPayload(payload);
        }
    };

    xhr.send();
}
