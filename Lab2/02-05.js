var http = require('http')
var fs = require('fs') //Доступ к файловой системе

http.createServer((req, response)=>
  {
    if(req.url === '/api/name')
    {
        response.writeHead(200, {'Content-Type': 'text/plain'})
        response.end('Ковалев Александр');  
    }
    if(req.url === '/fetch')
    {
        fs.stat
        ('fetch.html', (err, stat)=>
          {
            if(err)
            {
              ErrHandler(response);
              console.log('error', err);
            }
            let html = fs.readFileSync('fetch.html');
            response.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
            response.end(html);
          }
        )
    }
  }
).listen(5000);

console.log('Server running at http://localhost:5000/');
