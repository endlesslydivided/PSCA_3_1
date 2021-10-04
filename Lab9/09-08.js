const http = require('http');
const fs = require('fs');

http.createServer(function(request, response) {
    if(request.method === 'GET')
    {
    response.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
    let readableStream = fs.createReadStream('MyFile2.txt');
    readableStream.on('end', (data) => {
        response.end();
    });

    readableStream.pipe(response);
    }
}).listen(8080);

console.log("http://localhost:8080/")

