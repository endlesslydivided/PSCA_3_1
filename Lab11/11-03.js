const WebSocket = require('ws');

const ws = new WebSocket.Server(
    {
        port:5000, 
        host:'localhost'
    }
);

ws.on('connection',(ws)=>
{
    console.log(ws.client.size);

    setInterval(() =>
        {
        console.log('server: ping');
        ws.ping('server: ping')
        },5000
    )
});

ws.on('error',(e)=> {
    console.log('error',e);
})
