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
    const str = WebSocket.createWebSocketStream(ws,{encoding:'utf8'});
    let rfile = fs.createReadStream(`./download/MyFile.txt`);
    rfile.pipe(str);
})