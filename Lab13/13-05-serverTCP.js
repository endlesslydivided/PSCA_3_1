const net = require('net');

let HOST = '0.0.0.0';
let PORT = 4000;

let sum = 0;

let connections = new Map();

let Server = net.createServer();
Server.on('connection', (socket) => {

    socket.id = (new Date()).toISOString();
    connections.set(socket.id, 0);
    console.log(`Server socket connected: ${socket.remoteAddress}:${socket.remotePort}`);

    socket.on('data', (data) => 
    {
        console.log(`Server data: ${data.readInt32LE()}`);
        sum = data.readInt32LE() + connections.get(socket.id);
        connections.set(socket.id, sum);
        console.log(`Sum: ${sum}`);
        sum = 0;
    });

    let buffer = Buffer.alloc(4);
    let writer = setInterval(() => 
    {
        buffer.writeInt32LE(connections.get(socket.id), 0);
        socket.write(buffer);
    }, 5000);

    socket.on('close', (data) => 
    {
        clearInterval(writer);
        connections.delete(socket.id);
        console.log("Server socket closed");
    });

    socket.on('error', (e) => {
        console.log(`Server error: ${e}`);
        connections.delete(socket.id);
    });

});

Server.on('listening', () => {
    console.log(`Server connected: ${HOST}:${PORT}`);
});
Server.on('error', (e) => {
    console.log(`TCP-Server error: ${e}`);
});

Server.listen(PORT, HOST);
