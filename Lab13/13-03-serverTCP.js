const net = require('net');

let HOST = '0.0.0.0';
let PORT = 4000;
let sum = 0;

let Server = net.createServer();
Server.on('connection',(socket) =>{

    let buffer = Buffer.alloc(4);
    let writer = setInterval(() => 
    {
        buffer.writeInt32LE(sum, 0);
        socket.write(buffer);
    }, 5000);

    console.log(`Server socket connected: ${socket.remoteAddress}:${socket.remotePort}`);

    socket.on('data', (data) =>
    {
        console.log(`Server socket data: ${data.readInt32LE()}`);
        sum += data.readInt32LE();
        console.log(`Sum: ${sum}`);
    });

    socket.on('close', data => {
        clearInterval(writer);
        console.log("Server socket closed");
    });

    socket.on('error', (e) => {
        console.log(`Server socket error: ${e}`);
    });

});

Server.on('listening', () => {
    console.log(`Server connected: ${HOST}:${PORT}`);
});
Server.on('error', (e) => {
    console.log(`TCP-Server error: ${e}`);
});

Server.listen(PORT, HOST);
