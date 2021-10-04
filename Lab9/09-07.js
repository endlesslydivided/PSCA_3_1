const http = require('http');
const fs = require('fs');


http.createServer(function(request, response) {
    if(request.method === 'GET')
    {
        
    response.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});

    let png = '';
    let stream = new fs.ReadStream('pic.png');
    stream.on('data', (chunk) => {
    response.write(chunk);
    console.log(Buffer.byteLength(chunk));
    })    

    response.end;
    }
}).listen(8080);

console.log("http://localhost:8080/")