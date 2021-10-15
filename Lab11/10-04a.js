const WebSocket = require('ws');
const ws = new WebSocket('ws://localhost:5000');

let parm = process.argv[2];
let prfx = typeof parm == 'undefined' ? 'ABC' :parm;

ws.on('opne',()=>{
    ws.on('message',(data)=>{
        data = JSON.parse(data);
        console.log('on message: ',data);
    });

    setInterval(()=>{
        ws.send(JSON.stringify(
            {
                x:prfx,
                t: new Date.toISOString()
            }
        ))
    })
});

ws.on('error',(e)=>{
    console.log('ws server error: ',e)
});