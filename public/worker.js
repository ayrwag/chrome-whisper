self.onmessage = function(e) {
    const fileData = e.data;
    const base64String = arrayBufferToBase64(fileData);
    self.postMessage(base64String);
};

function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}