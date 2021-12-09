const http = require("http");
const fs = require("fs");
const websocket = require("ws");
const url = require('url');
const { log } = require("console");
const pathToFile = './file/StudentList.json';
const pathToBackup = './backup';

http.createServer((request,response)=>
{
    switch(request.method)
    {
        case 'GET': getHandler(request, response); break;
        case 'POST': postHandler(request, response); break;
        case 'PUT': putHandler(request, response); break;
        case 'DELETE': deleteHandler(request, response); break;
    }
}).listen(5000, 'localhost', ()=>{console.log('Server running at http://localhost:5000');});

let wss = new websocket.Server({port: 4000, host: 'localhost', path: '/broadcast'});

fs.watch(pathToFile,{encoding: 'buffer'},(eventType,fileName)=>
{
    if(eventType === 'change')
    {
        wss.clients.forEach((client) =>
        {
            if(client.readyState == websocket.OPEN)
            {
                client.send(`Файл ${fileName} был изменён`)
            }
        })
    }
})


function getHandler(request,response)
{
    let path = url.parse(request.url).pathname;
    switch(true)
    {
        case path === '/':
        {
            response.setHeader('Content-Type','application/json; charset:utf-8');
            response.end(readFile(pathToFile).toString());
            break;
        }
        case (new RegExp(/\/\d+/)).test(path):
        {
            let fileJSON = readFile(pathToFile);
            let id = Number(path.match(/\d+/)[0]);
            JSON.parse(fileJSON).forEach(item=>
            {
                if(item.id === id)
                {
                    response.setHeader('Content-Type','application/json');
                    response.write(JSON.stringify(item));
                }

            });
            if(!response.hasHeader('Content-Type'))
            {
                errorHandler(request,response,1,`Студент с id ${id} не существует!`);
            }

            response.end();
            break;
        }
        case path === '/backup':
        {
            fs.readdir('./backup', (err,files)=>
            {
                response.setHeader('Content-Type','application/json');
                let json = [];
                for (let i = 0; i < files.length;i++)
                {
                    json.push({
                        id: i,
                        name: files[i]
                    });
                }
                response.end(JSON.stringify(json));
                console.log(files.length);
            });
            break;
        }
        default:
            {
                response.writeHead(404,{'Content-Type': 'application/json;charset=utf-8'});
                response.end('error 404');
                break;
            }
    }
};
//{"id":6,"name":"Бабубель Бубений Бубеневич","bday":"2002-05-06","specility":"ИСиТ"},


/*[{"id":1,"name":"Ковалев Александр Александрович", "bday":"2002-09-04","specility":"ПОИТ"},
{"id":2,"name":"Батурель Евгений Дмитриев","bday":"2001-12-03","specility":"ПОИТ"},
{"id":3,"name":"Михалькевич Алексей Вячеславович","bday":"2002-05-05","specility":"ПОИТ"},
{"id":4,"name":"Шуст Юрий Олегович","bday":"2002-06-05","specility":"ПОИТ"},
{"id":5,"name":"Ерчинская Наталья Васильевна","bday":"2002-11-02","specility":"ПОИТ"}]*/
function postHandler(request,response)
{
    let path = url.parse(request.url).pathname;
    switch(path)
    {
        case '/':
        {
            let body = '';
            request.on('data',function(data)
            {
                body += data;
            });
            request.on('end',function()
            {
                let flag = true;
                let fileJSON = JSON.parse(readFile(pathToFile));
                fileJSON.forEach(item =>
                {
                    if(item.id === JSON.parse(body).id)
                    {
                        flag = false;
                    }
                });
                if(flag)
                {
                    fileJSON.push(JSON.parse(body));
                    fs.writeFile(pathToFile, JSON.stringify(fileJSON), (e) => 
                    {
                        if (e) 
                        {
                            console.log('Error');
                            errorHandler(request, response, e.code, e.message);
                        }
                        else 
                        {
                            console.log('Добавлен студент');
                            response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
                            response.end(JSON.stringify(JSON.parse(body)));
                        }
                    });
                }
                else
                {
                    errorHandler(request,response,2, `Студент с id ${JSON.parse(body).id} уже существует`);
                }
            });
            break;
        }
        case '/backup':
        {
            let date = new Date();
            fs.copyFile(pathToFile, `./backup/${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}_StudentList.json`, (err) => 
            {
                if (err) 
                {
                    console.log('Error');
                    errorHandler(request, response, err.code, err.message);
                }
                else 
                {
                    console.log('Копия была создана');
                    response.end('Копия была создана');
                }
            });
            break;
        }
        default:
        {
            response.writeHead(404, {'Content-Type': 'application/json; charset=utf-8'});
            response.end(`error 404`);
        }
    };
};

function deleteHandler(request,response)
{
    let path = url.parse(request.url).pathname;
    switch(true)
    {
        case (new RegExp(/\/backup\/\d+/)).test(path):
        {
            let flag = false;
            fs.readdir('./backup', (err, files) => 
            {
                for (let i = 0; i < files.length; i++) 
                {
                    if (files[i].match(/\d{7,8}/)[0] >= Number(path.match(/\d{7,8}/))) 
                    {
                        flag = true;
                        fs.unlink(`./backup/${files[i]}`, (e) => 
                        {
                            if (e) 
                            {
                                console.log('Error');
                                errorHandler(request, response, e.code, e.message);
                            } else 
                            {
                                console.log('Ok');
                                response.end('Ok');
                            }
                        });
                    }
                }
                if (!flag) {
                    errorHandler(request, response, 3, 'Нет файлов');
                }
            });
            break;
        };
        case (new RegExp(/\/\d+/)).test(path):
        {
            let fileJSON = JSON.parse(readFile(pathToFile));
            let id = Number(path.match(/\d+/)[0]);
            for (let i = 0; i < fileJSON.length; i++) 
            {
                if (fileJSON[i].id === id)
                {
                    response.setHeader('Content-Type', 'application/json');
                    response.write(JSON.stringify(fileJSON[i]));
                    delete fileJSON[i];
                    fileJSON = fileJSON.filter(function(x) 
                    {
                        return x !== null;
                    });
                    console.log('Студент удален');
                }
            }
            if(!response.hasHeader('Content-Type')) 
            {
                errorHandler(request, response, 1, `Студент с ${id} не существует`);
            }
            else 
            {
            fs.writeFile(pathToFile, JSON.stringify(fileJSON), (e) => 
                {
                    if (e) 
                    {
                        console.log('Error');
                        errorHandler(request, response, e.code, e.message);
                    }
                    else 
                    {
                        response.end();
                    }
                });
            }
            break;
        }
    }
};

function putHandler(request,response)
{
    let path = url.parse(request.url).pathname;
    if(path === '/')
    {
        let body = '';
        request.on('data', function(data)
        {
            body += data;
        });
        request.on('end',function()
        {
            let fileJSON = JSON.parse(readFile(pathToFile));
            let flag = true;
            fileJSON.forEach(item =>
            {
                if(item.id === JSON.parse(body).id)
                {
                    flag = false;
                }
            });
            if(!flag)
            {
                for(let i = 0; i < fileJSON.length; i++)
                {
                    if(fileJSON[i].id === JSON.parse(body).id)
                    {
                        fileJSON[i] = JSON.parse(body);
                        fs.writeFile(pathToFile,JSON.stringify(fileJSON),(e)=>
                        {
                            if(e)
                            {
                                console.log('ERROR');
                                errorHandler(request,response,e.code,e.message);
                            }
                            else
                            {
                                flag = true;
                                console.log('Студент был изменён');
                                response.writeHead(200,{'Content-Type':'application/json;charset=utf-8'});
                                response.end(JSON.stringify(JSON.parse(body)));
                            }
                        })
                    }
                }
            }
            else
            {
                errorHandler(request,response,1,`Студент с id ${JSON.parse(body).id} не существует`);
            }
        })
    }
    else
    {
        response.writeHead(404, {'Content-Type': 'application/json; charset=utf-8'});
        response.end(`error 404`);
    }
};

function readFile(pathToFile)
{
    try
    {
        fs.accessSync(pathToFile);

        stats = fs.lstatSync(pathToFile);
        if (stats.isDirectory())
        {
            process.stderr.write('ERROR: It is not a file!\n');
            process.exit(1);
        }

        return fs.readFileSync(pathToFile).toString();
    }
    catch(e)
    {
        process.stderr.write(`ERROR: ${e}`);
        process.exit(1);
    }
};

function errorHandler(request, response, code, message)
{
    response.writeHead(500, {'Content-Type': 'application/json; charset=utf-8'});
    response.end(`{"error": "${code}", "message": "${message}"}`);
};