const http = require('http');
const query = require('querystring');
const url = require('url');

http.createServer(function(request, response) {
    let parsedQuery = url.parse(request.url, true).query;
    response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    response.end(`<h1>x = ${+parsedQuery.x}; y = ${parsedQuery.y}</h1>`);
}).listen(8080);

let parameters = query.stringify({x: 3, y: 5});
let path = `/?${parameters}`;

let options = {
    host: 'localhost',
    path: path,
    port: 8080,
    method: 'GET'
};

let request = http.request(options, (response) => {
    console.log('status code:', response.statusCode);

    let responseData = '';
    response.on('data', (chunk) => {
        console.log('body=', responseData += chunk.toString('utf-8'));
    });
});

request.end();
