const fs = require('fs');
const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:5000');

let k = 0;
ws.on('open', ()=>{
    const str = WebSocket.createWebSocketStream(ws, {encoding: 'utf8'});
    let wfile = fs.createWriteStream(`./upload/${++k}.txt`);
    str.pipe(wfile);
});