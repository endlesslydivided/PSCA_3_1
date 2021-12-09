const udp = require('dgram');

const PORT = 4000;
let server = udp.createSocket('udp4');

server.on('message', (message, info) => 
{
    MsgBuff = message.toString();
    console.log(`message ${info.address}:${info.port} = ${MsgBuff}`);
    MsgBuff = `ECHO:${MsgBuff}`;
    server.send(MsgBuff, info.port, info.address, (err) => 
    {
        if (err) 
        {
            server.close();
        }
        else 
        {
            console.log('Sended');
        }
    });
});
    server.on('error', (err) => 
    {
        console.log('Error: ' + err);
        server.close();
    });

    server.on('listening', () => 
    {
        console.log(`Server PORT: ${server.address().port}`);
        console.log(`Server Address: ${server.address().address}`);
        console.log(`Server IPv: ${server.address().family}`);
    });

    server.on('close', () => console.log('Server CLOSED'));
    

server.bind(PORT);
