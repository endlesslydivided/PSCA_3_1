var http = require('http')
var fs = require('fs') 

http.createServer((req, response)=>
  {
    if(req.url === '/png')
    {
        fs.stat
        ('pic.png', (err, stat)=>
          {
            if(err)
            {
              ErrHandler(response);
              console.log('error', err);
            }
            let png = fs.readFileSync('pic.png');
            response.writeHead(200, {'Content-Type': 'image/png','Content-Length':stat.size});
            response.end(png,'binary');  
          }
        )
    }
  }
).listen(5000);

console.log('Server running at http://localhost:5000/');
