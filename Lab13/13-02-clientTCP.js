const net = require('net');

let HOST = '127.0.0.7';
let PORT = 2000;

let parmMESSAGE = process.argv[2];

let message = typeof parmMESSAGE == 'undefined' ? 'Message to Server' : parmMESSAGE;

let client = net.Socket();

client.connect(PORT,HOST,()=>{
    console.log(`Client socket connected: ${client.remoteAddress}:${client.remotePort}`);
});

client.on('data', data =>{
    console.log(`Client socket data: ${data.toString()}`);
});

client.on('close',() =>{
    console.log('Client socket closed');
});

client. on('error',(e)=>
{
    console.log(`Client socket error:`,e);
});

client.write(message);





