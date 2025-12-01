

export function hexToBuf(hex) {
    var typedArray = new Uint8Array(hex.match(/[\da-f]{2}/gi).map(function (h) {
        return parseInt(h, 16)
    }));

    return typedArray.buffer;
}

export function bufToHex(buffer) {
    return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join(' ').toUpperCase();
}



//方法1
//Buffer转ArrayBuffer
export  function toArrayBuffer(buf) {
    var ab = new ArrayBuffer(buf.length);
    var view = new Uint8Array(ab);
    for (var i = 0; i < buf.length; ++i) {
        view[i] = buf[i];
    }    
    return ab;        
}

//ArrayBuffer转Buffer
export  function toBuffer(ab) {
    var buf = new Buffer(ab.byteLength);
    var view = new Uint8Array(ab);
    for (var i = 0; i < buf.length; ++i) {
        buf[i] = view[i];
    }
    return buf;
}