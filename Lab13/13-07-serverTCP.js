const net = require('net');

let HOST = '0.0.0.0';
let PORT_O = 40000;
let PORT_S = 50000;

net.createServer((Server) => ServerStart(Server)).listen(PORT_O, HOST);
net.createServer((Server) => ServerStart(Server)).listen(PORT_S, HOST);

function ServerStart(socket) {
    

    socket.on('data', (data) => {
        num = data.readInt32LE().toString();
        console.log(`Server data: ${num}`);
        socket.write('ECHO: ' + num);
    });

    console.log(`Server connected: ${socket.remoteAddress}:${socket.remotePort}`);
    socket.on('error', (e) => {
        console.log(`Server error: ${e}`);
    });

    let num = 0;
}
