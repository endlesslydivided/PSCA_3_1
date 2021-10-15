const rpc = require('rpc-websockets').Client;
const eventSocket = new rpc('ws://localhost:4000');

eventSocket.on('open', () => {
    eventSocket.subscribe('B');
    eventSocket.on('B', () => console.log('B event!\n' + new Date().toString()));
});