const rpcServer = require('rpc-websockets').Server;

const eventSocket = new rpcServer({ port: 4000, host: 'localhost', path: '/'});

eventSocket.event('A');
eventSocket.event('B');
eventSocket.event('C');

console.log('Choose A, B, C event');

let input = process.stdin;

input.setEncoding('utf-8');
process.stdout.write('-');
input.on('data', (data) =>{
    eventSocket.emit(data.slice(0,-1));
    process.stdout.write('- ');
});
