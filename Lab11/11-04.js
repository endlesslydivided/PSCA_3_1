const WebSocket = require('ws');

const wss = new WebSocket.Server(
    {
        port:5000, 
        host:'localhost'
    }
);

wss.on('connection', (ws)=>{
    let data2;
    ws.on('message', (data)=>{
        data2 =  JSON.parse(data);
        console.log('on message: ', data);
    });

    let count_of_messages = 0;
    wss.clients.forEach((client)=>
    {
        if(client.readyState === WebSocket.OPEN)
        {
            setInterval(()=> {ws.send(JSON.stringify({n: count_of_messages++, x: data2.x, t: (new Date()).toString()}))}, 6000);
        }
    })
});

wss.on('error', (e)=>{
    console.log('wss server error', e)
});
