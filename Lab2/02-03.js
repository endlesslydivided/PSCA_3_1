var http = require('http')
var fs = require('fs') //Доступ к файловой системе

http.createServer((req, response)=>
  {
    if(req.url === '/api/name')
    {
        response.writeHead(200, {'Content-Type': 'text/plain;charset=utf-8'});
        response.end('Ковалев Александр'); 
    }
  }
).listen(5000);

console.log('Server running at http://localhost:5000/');
