const http = require('http');
const fs = require('fs');
const url = require('url');

http.createServer(function(request,response)
{
    response.writeHead(200,{'Content-type': 'text/html;charset=utf-8'});
    if(url.parse(request.url).pathname === '/' && request.method === 'GET')
    {
        fs.readFile('./page.html', (err, data) => {
            response.end(data);
        });
    }
    if (url.parse(request.url).pathname === '/' && request.method === 'POST') {
        let body = '';
        request.on('data', (chunk) => { body += chunk.toString(); });
        request.on('end', () => {
            let parm = JSON.parse(body);
            response.end('Status: OK.\nSender: ' + parm.from + ' .\nReceiver: ' + parm.to + ' .\nMessage: ' + parm.message);
        });
    }
}).listen(3000);

console.log('Server running at http://localhost:3000/');