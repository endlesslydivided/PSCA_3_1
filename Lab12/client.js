const websocket = require('ws');
const ws = new websocket('ws://localhost:4000/broadcast');

ws.on('message', (message) => {
    console.log('Полученное сообщение -> ', message.toString());
});
