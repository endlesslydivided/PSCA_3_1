const rpc = require('rpc-websockets').Client;
const eventSocket = new rpc('ws://localhost:4000');

eventSocket.on('open',()=>{
    eventSocket.subscribe('A');
    eventSocket.on('A',()=> 
    console.log('A event!\n' + new Date().toString());
});