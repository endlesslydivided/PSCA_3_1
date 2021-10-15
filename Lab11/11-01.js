const fs = require('fs');
const WebSocket = require('ws');

const ws = new WebSocket.Server(
    {
        port:5000,
        host:'localhost'
    }
)

let k = 0;
ws.on('connection',(ws)=>
{
    const duplex = WebSocket.createWebSocketStream(ws,{encoding:'utf8'});
    let wfile = fs.createWriteStream(`./upload/file${++k}.txt`);
    duplex.pipe(wfile);
})