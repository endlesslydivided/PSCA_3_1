const rpcServer = require('rpc-websockets').Server;

const eventSocket = new rpcServer({ port: 4000, host: 'localhost'});

eventSocket.event('A');
eventSocket.event('B');
eventSocket.event('C');

console.log('Choose A, B, C event');

let input = process.stdin;

input.setEncoding('utf-8');
input.on('data', (data) =>{
    let getData = data.slice(0,1);
    eventSocket.emit(getData,{x: `Event emmited: ${getData}`,date: (new Date).toTimeString()});
});
