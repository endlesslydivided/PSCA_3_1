const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:5000');


ws.on('pong', (data) =>
{
    console.log('Pong started');
    ws.ping(1);
})
.on('error', (e)=> {console.log('WS server error ', e);});
ws.onmessage = (e) => {console.log("Message server: ", e.data);};