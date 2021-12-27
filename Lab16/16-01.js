const http = require('http');

const { DB } = require('./DB/DB');
const resolver = require('./resolver');
const {graphql, buildSchema} = require('graphql');
const schema = buildSchema(require('fs').readFileSync('./schema.gql').toString());

const server = http.createServer();

const context = DB((error) => 
{
    if (error) 
    {
        console.error('Не удалось подключиться к базе данных');
    }
    else 
    {
        console.log('Подключение к базе данных прошло успешно');
        server.listen(3000, () => 
        {
            console.log('Сервер: http://localhost:3000/')})
            .on('error', (error) => { console.log('Ошибка:', error.code); })
            .on('request', handler);
    }
});

const handler = (request, response) => 
{
    if (request.method === 'POST') 
    {
        let reqData = '';
        request.on('data', (data) => 
        { 
            reqData += data; 
        });
        request.on('end', () => 
        {
            try 
            {
                let data = JSON.parse(reqData);
                if (data.query) 
                {
                    graphql(schema, data.query, resolver, context, data.variables ? data.variables : {})
                        .then((result) => 
                        {

                            if (result.errors) 
                            {
                                let json = JSON.stringify(result.errors);

                                console.log(json);
                                response.writeHead(400, {'Content-Type':'application/json; charset=utf-8'});
                                response.end(json);
                            }
                            else if (result.data) 
                            {
                                let json = JSON.stringify(result.data);

                                console.log(json);
                                response.writeHead(200, {'Content-Type':'application/json; charset=utf-8'});
                                response.end(json);
                            }
                           
                        })
                }
            }
            catch (e) 
            {
                let json = JSON.stringify({message: 'Ошибка запроса'});
                console.log(json);
                response.writeHead(400, {'Content-Type':'application/json; charset=utf-8'});
                response.end(json);            
            }
        })
    }
    else {
        let json = JSON.stringify({message: 'Неверный метод'});
        console.log(json);
        response.writeHead(405, {'Content-Type':'application/json; charset=utf-8'});
        response.end(json);   
    }
};
