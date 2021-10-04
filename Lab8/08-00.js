const http = require('http');
const url = require('url');
const needle = require('needle');
const fs = require('fs');
const mp = require('multiparty');
const parseString = require('xml2js').parseString;
const xmlbuilder = require('xmlbuilder');

let server = http.createServer();

server.keepAliveTimeout = 2000;

let clientSocket = {};

let http_handler = (req,res) => 
{
    res.address = 'http://localhost:5001';

    if(url.parse(req.url).pathname === '/connection')
    {
        if(!url.parse(req.url,true).query.set)
        {
            res.writeHead(200,{'Content-Type': 'text/html;'});
            res.end(`<h1>KeepAliveTimeout: ${server.keepAliveTimeout}</h1>`);
        }
        else
        {
            server.keepAliveTimeout = +url.parse(req.url,true).query.set;
            res.writeHead(200,{'Content-Type': 'text/html;charset=utf-8'});
            res.end(`<h1>New value of KeepAliveTimeout: ${server.keepAliveTimeout}</h1>`);
        }
    }

    if(url.parse(req.url).pathname === '/heads') 
    {
        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8 ','MyHeader': 'MyHeaderValue'});
        res.end("Hi!");
    }
    if(url.parse(req.url).pathname === '/headers') 
    {
        let html = fs.readFileSync('headers.html');
        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        for(key in req.headers)
        res.write(`<h3>request: ${key}: ${req.headers[key]}</h3>`);
        res.end(html);
    }

    if(url.parse(req.url).pathname === '/parameter') 
    {   
        x = +url.parse(req.url, true).query.x;
        y = +url.parse(req.url, true).query.y;
        if(Number.isInteger(x) && Number.isInteger(y)) 
        {
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
            res.end(`<h2>Sum: ${x + y}</h2> \n <h2>Sub: ${x - y}</h2> \n <h2>Mult: ${x * y}</h2> \n <h2>Division: ${x / y}</h2>`);
        } 
        else 
        {
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
            res.end(`<h2>${url.parse(req.url).pathname}</h2> \n <h2>Parameters are not number</h2>`);
        }
    }

    if(RegExp(/^\/parameter\/[0-9]{1,100}\/[0-9]{1,100}/).test(url.parse(req.url).pathname)) 
    {
        res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
        var p = url.parse(req.url, true);
        x = +p.pathname.split('/')[2];
        y = +p.pathname.split('/')[3];

        if(Number.isInteger(x) && Number.isInteger(y)) 
        {
            res.end('<h1>X and Y are int</h1>'
            + `<p>x = ${x}, y = ${y}</p>`
            + `<p>x + y = ${x + y}</p>`
            + `<p>x - y = ${x - y}</p>`
            + `<p>x * y = ${x * y}</p>`
            + `<p>x / y = ${x / y}</p>`);
        }
    }
    if(RegExp(/^\/parameter\/.\/./).test(url.parse(req.url).pathname))
    {
        res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
        res.end(res.address + req.url);
    }

    if(url.parse(req.url).pathname === '/close') 
    {
        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        res.end(`<h2>Server will be closed in 2 sec.</h2>`);
        setTimeout(()=> {server.close();}, 2000);
    }


    if(url.parse(req.url).pathname === '/socket') 
    {
        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        res.end(`<h2>localAddress: ${clientSocket.localAddress} \n localPort ${clientSocket.localPort} \n serverAddress ${JSON.stringify(server.address())}</h2>`);
    }

    if(url.parse(req.url).pathname === '/req-data') 
    {
        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        let buf = '';
        req.on('data', (data) => 
        {
            console.log('data = ', data);
            console.log('requsent.on(data) = ', data.length);
            buf += data;
        });
        req.on('end', () => 
        {
            console.log('request.on(end) = ', buf.length)
        });
        res.end('1');
    }

    if(url.parse(req.url).pathname === '/resp-status') 
    {
        if((x = +url.parse(req.url, true).query.code) && (y = url.parse(req.url, true).query.mess))  
        {
            res.statusMessage= y;
            res.writeHead(x, {'Content-Type': 'text/html; charset=utf-8'});
            res.end();
        }
    }

    if(url.parse(req.url).pathname === '/formparameter') 
    {
        if (url.parse(req.url).pathname === '/formparameter' && req.method === 'POST') 
        {
            res.writeHead(200, {'Content-Type': 'text/plain'});
            let data = '';
            req.on('data', chunk => { data += chunk; });
            req.on('end', () => 
            {
                console.log(data);
                res.end(data);
            });
        }
        if (url.parse(req.url).pathname === '/formparameter' && req.method === 'GET') 
        {
            let html = fs.readFileSync('form.html');
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
            res.end(html);
        }
    }

    if (url.parse(req.url).pathname === '/json' && req.method === 'POST') 
    {
        let data = '';
        req.on('data', (chunk) => { data += chunk; });
        req.on('end', () => 
        {
            res.writeHead(200, {'Content-type': 'application/json; charset=utf-8'});
            data = JSON.parse(data);
            let jsonResponse = {};
            jsonResponse.__comment = data.__comment.replace("Запрос.","Ответ:");
            jsonResponse.x_plus_y = data.x + data.y;
            jsonResponse.Concatenation_s_o = data.s + ': ' + data.o.surname + ', ' + data.o.name;
            jsonResponse.Length_m = data.m.length;
            res.end(JSON.stringify(jsonResponse));
        });
    }

/*
{
    "__comment": "Запрос.Лабораторная работа 8/10",
    "x":1,
    "y":2,
    "s":"Сообщение",
    "m":["a","b","c","d"],
    "o":{"surname":"Иванов","name":"Иван"}   
}
*/

    if (url.parse(req.url).pathname === '/xml' && req.method === 'POST') 
    {
        let data = '';
        req.on('data', (chunk) => { data += chunk; });
        req.on('end', () => 
        {
            res.writeHead(200, {'Content-type': 'application/xml'});
            parseString(data, function(err, result) 
            {
                let id = result.request.$.id;
                let xSum = 0;
                let mSum = '';
                result.request.x.forEach((p) => 
                {
                    xSum += parseInt(p.$.value);
                });
                result.request.m.forEach((p) => 
                {
                    mSum += p.$.value;
                });

                let xmlDoc = xmlbuilder.create('response').att('id', '33').att('request',id);
                xmlDoc.ele('sum').att('element', 'x').att('result', xSum).up().ele('concat').att('element', 'm').att('result', mSum);

                res.end(xmlDoc.toString());
            });
        });
    }
/*
<request id="28">
    <x value="1"/>
    <x value="1"/>
    <m value="a"/>
    <m value="b"/>
    <m value="c"/>
</request>
*/

    if (url.parse(req.url).pathname === '/files') 
    {
        res.setHeader('X-static-files-count', fs.readdirSync('./static').length);
        res.end();
    }

    if (RegExp(/^\/files\/[a-z]/).test(url.parse(req.url).pathname)) 
    {
        try 
        {
            let parsedUrl = url.parse(req.url, true);
            let data = fs.readFileSync('static/' + parsedUrl.pathname.split('/')[2]);
            res.end(data);
        } catch (e) 
        {
            res.writeHead(404, {'Content-type': 'text/html'});
            res.end('404 ' + e.toString());
        }
    }

    if (url.parse(req.url).pathname === '/upload') 
    {
        if(req.method === 'POST') 
        {
            let form = new mp.Form({uploadDir: './static'});
            form.on('file', (name, file) => { });
            form.on('error', (err)=>{res.end('Not uploaded!')});
            form.on('close', () => {
                res.writeHead(200, {'Content-type': 'text/plain'});
                res.end("Uploaded!");
            });
            form.parse(req);
        }
        if(req.method === 'GET') 
        {
            res.writeHead(200, {'Content-type': 'text/html'});
            res.end('<form method="POST" action="/upload" enctype="multipart/form-data">' +
                '<input type="file" name="file"/>' +
                '<input type="submit"/>' +
                '</form>');
        }
    }
};

let conn = 0;
server.on('connection', socket => {
    console.log(conn++);
    clientSocket.localAddress = socket.localAddress;
    clientSocket.localPort = socket.localPort;
});



server.on('request', http_handler);
server.listen(5001);

console.log("http://localhost:5001");
server.on('close',()=>{console.log("Server is closed")});
