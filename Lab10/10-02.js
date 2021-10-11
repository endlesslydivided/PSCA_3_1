const WebSocket = require('ws');

let k = 0;
let socket = new WebSocket('ws:/localhost:4000/wsserver');
socket.onopen = () => {
    console.log('socket.onopen');
    let timer = setInterval(() => { socket.send(`10-02 client: ${++k}`); },3000);
    setTimeout(()=> {clearInterval(timer); socket.close(console.log('Client socket is closed'))},20000);

};

socket.onclose = () => { console.log('socket.onclose'); };
socket.onmessage = (e) => { console.log('socket.onmessage', e.data); };
socket.onerror = function(error) { console.log('Error: ' + error.message); };
