const net = require("net");
const client = new net.Socket()
let isConnected = false;
let interval = false;

function connect() {
    client.connect({
        port: 8082,
        host: '192.168.31.147'
    })
}

function launchIntervalConnect() {
    console.log('isConnected: ' + isConnected);
    if (false != isConnected) return
    interval = setInterval(connect, 5000)
}

function clearIntervalConnect() {
    if (false == isConnected) return
    clearInterval(interval)
    interval = false
}

client.on('connect', () => {
    isConnected = true
    clearIntervalConnect()
    console.log('connected to server', 'TCP')
})

client.on('error', (err) => {
    isConnected = false
    console.log('----->error', err.message)
    if (!interval) {
        launchIntervalConnect()
    }
})
client.on('close', () => {
    isConnected = false
    console.log('----->close');
    if (!interval) {
        launchIntervalConnect()
    }
})
client.on('end', () => {
    isConnected = false
    console.log('------>end');
    if (!interval) {
        launchIntervalConnect()
    }
})

connect()

// const net = require("net");
// const client = new net.Socket();
// let isConnected = false;
// client.connect(8082, "127.0.0.1", () => {
//     isConnected = true
//     console.log("连接到服务器");
// })
// client.on("error", function (err) {
//     if (err.message.indexOf('EPIPE') != -1||err.message.indexOf('ECONNREFUSED1') != -1) {
//         console.log("尝试重新连接...");
//         client.connect(8082, "127.0.0.1", () => {
//             isConnected = true
//             console.log("连接到服务器");
//         })
//         isConnected = false

//     }
//     console.log("连接中断", err.message);
// });
// setInterval(() => {
//     if (!isConnected) {
//         console.log("尝试重新连接...");
//         client.connect(8082, "127.0.0.1", () => {
//             isConnected = true
//             console.log("连接到服务器");
//         })
//     }
// }, 2000);
const fs = require("fs");
const readline = require("readline");
console.log(__dirname);

const rl = readline.createInterface({
    input: fs.createReadStream(__dirname + "/坐姿.txt"),
    crlfDelay: Infinity,
});
let data = []
rl.on("line", (line) => {
    line = line.replace('5A 01 95 6C 00 02', "")
    line = line.substring(line.lastIndexOf(":") + 2, line.length);
    let l1 = line.substring(0, line.length / 2)
    let l2 = line.substring(line.length / 2, line.length)
    l1 = '5A 01 95 6C 00 02 DE 01' + l1 + ' DD EE'
    l2 = '5A 01 95 6C 00 02 DE 02' + l2 + ' DD EE'
    data.push({ l1, l2 });
})
let index = 0
setTimeout(() => {
    setInterval(() => {
        if (isConnected) {
            client.write(data[index].l1);
            setTimeout(() => {
                client.write(data[index].l2);
            }, 50);
            index++;
            index %= data.length;
        }
    }, 1000 / 8);
}, 1000)
