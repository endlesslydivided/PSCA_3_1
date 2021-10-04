const http = require('http');

http.createServer(function(request, response) {
    let data = '';
    request.on('data', (chunk) => { data += chunk; });
    request.on('end', () => {
        response.writeHead(200, {'Content-type': 'application/json; charset=utf-8'});
        data = JSON.parse(data);
        let jsonResponse = {};
        jsonResponse.__comment = 'Ответ: ' + data.__comment;
        jsonResponse.x_plus_y = data.x + data.y;
        jsonResponse.Concatenation_s_o = data.s + ' ' + data.o.surname + ' ' + data.o.name;
        jsonResponse.Length_m = data.m.length;

    response.end(JSON.stringify(jsonResponse));
    });
}).listen(8080);

let parameters = JSON.stringify({
    __comment: "Запрос",
    x: 1,
    y: 2,
    s: "Lab9",
    m: [1, 2, 4],
    o: {
        surname:"Фамилия",
        name: "Имя"
    }
});

let options = {
    host: 'localhost',
    path: '/',
    port: 8080,
    method: 'POST',
    headers: {
        'Content-Type':'application/json',
        'Accept': 'application/json'
    }
};

let request = http.request(options, (response) => {
    console.log('status code:', response.statusCode);

    let responseData = '';
    response.on('data', (chunk) => {
        responseData += chunk.toString('utf-8');
    });
    response.on('end', () => {
        console.log('Тело: ', responseData);
        console.log('parsed body: ', JSON.parse(responseData));
    });
});

request.end(parameters);
