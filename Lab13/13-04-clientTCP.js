const net = require('net');

let HOST = '127.0.0.1';
let PORT = 4000;

let client = new net.Socket();
let buffer = new Buffer.alloc(4);

client.connect(PORT, HOST, () => {

    let X = 1;

    let writer = setInterval(() => {
        client.write((buffer.writeInt32LE(X++, 0), buffer));
    }, 1000);

    setTimeout(() => {
        clearInterval(writer);
        client.end();
    }, 20000);

    console.log(`Client socket connected: ${client.remoteAddress}:${client.remotePort}`);

});


client.on('data', data => {
    console.log(`Client socket data: ${data.readInt32LE()}`);
});

client.on('close', () => {
    console.log('Client socket closed');
});

client.on('error', (e) => {
    console.log('Client socket error: ', e);
});
