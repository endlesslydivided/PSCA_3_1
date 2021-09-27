const http = require('http');

http.createServer(function(request, response) {
    if(request.method === 'GET') {
        response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        response.end('<h1>Hello</h1>');
    }
}).listen(8080);

let options = {
    host: 'localhost',
    path: '/',
    port: 8080,
    method: 'GET'
};

let request = http.request(options, (response) => {
    console.log('status code:', response.statusCode);
    console.log('status message:', response.statusMessage);
    console.log('IP address of remote server:', response.socket.remoteAddress);
    console.log('Port of remote server:', response.socket.remotePort);

    let responseData = '';
    response.on('data', (chunk) => {
        console.log('body: ', responseData += chunk.toString('utf-8'));
    });
});

request.end();
