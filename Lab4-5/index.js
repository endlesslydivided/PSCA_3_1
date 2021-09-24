const http = require('http');
const url = require('url');
const fs = require('fs');
const DataBase = require('./DB/DataBase');
const sockets = new Set();

let db = new DataBase();

let timerSd = null;
let timerSc = null;
let timerSs = null;
let countRequest = 0;
let countCommit = 0;

db.on('GET', async (request, response) => 
{
	console.log('GET');

    await response.end( JSON.stringify( await db.select()));
});

db.on('POST', async  (request, response) => {
	console.log('POST');
    request.on('data', async data => {
        let row = JSON.parse(data);
        await response.end(JSON.stringify(await db.insert(row)));
    });
});

db.on('PUT', async (request, response) => {
	console.log('PUT');
    request.on('data', async data => {
        let row = JSON.parse(data);
        await response.end(JSON.stringify(await db.update(row)));
    }); 
});

db.on('DELETE', async (request, response)=>{
    console.log('Delete');
    await response.end(JSON.stringify(await db.delete(url.parse(request.url, true).query.id)));
});

db.on('HEAD', () => {
    console.log('\nCOMMIT');
    countCommit++;
    db.commit();
});

var server = http.createServer(function (request, response) 
{
	if(url.parse(request.url).pathname === '/api/db') 
    {
        countRequest++;
		db.emit(request.method, request, response);
	}
	else if(url.parse(request.url).pathname === '/') 
    {
        let page = fs.readFileSync('./index.html');
        response.writeHead(200, {'Content-Type' : 'text/html; charset=utf-8'});
        response.end(page);
    }
    else if (request.url === '/api/ss') {
        response.writeHead(200, {'Content-Type':'application/json'});
        response.end(JSON.stringify(printStatic()));
    }
}).listen(5000, 'localhost', ()=>{console.log('Server running at http://localhost:5000/');});

process.stdin.setEncoding('utf-8');
process.stdin.unref();

process.stdin.on('readable', () => 
{
  let command = null;
  while ((command = process.stdin.read()) != null) 
  {
    if (command.trim().startsWith('sd')) 
    {
        if(server.listening) 
        {
            let sec = Number(command.trim().replace(/[^\d]/g, ''));
            if(sec) 
            {
                clearTimeout(timerSd);
                timerSd = setTimeout(() => {
                    close();
                    sdTimer = null;
                    },1000 * sec);
                console.log(`Server exit after ${sec} sec`);
            }
            if(!sec && command.trim().length > 2) 
            {
                console.error("ERROR! Parameter isn\'t int");
            }

            if(command.trim().length === 2) 
            {
                clearTimeout(timerSd);
                console.log('Undo exit server');
            }
        }
        else 
        {
            console.error("Server is not listening");
        }
    }

    if (command.trim().startsWith('sc')) 
    {
        let sec = Number(command.trim().replace(/[^\d]/g, ''));
        if(sec) 
        {
            clearTimeout(timerSc);
            timerSc = setInterval( () => { db.emit('HEAD') }, sec * 1000);
            timerSc.unref();
        }

        if(!sec && command.trim().length > 2) 
        {
            console.error("ERROR! Parameter isn\'t int");
        }

        if(command.trim().length === 2) 
        {
            clearTimeout(timerSc);
            console.log('Undo commit');
        }
    }

    if (command.trim().startsWith('ss')) 
    {
          let sec = Number(command.trim().replace(/[^\d]/g, ''));
          if(sec) 
          {
              clearTimeout(timerSs);
              timerSs = setInterval( () => { process.stdout.write(printStatic()); }, sec * 1000);
              timerSs.unref();
          }

          if(!sec && command.trim().length > 2) 
          {
              console.error("ERROR! Parameter isn\'t int");
          }

          if(command.trim().length === 2) 
          {
              clearTimeout(timerSs);
              console.log('Undo statistic');
          }
    }
  }
});

function printStatic() {
    let start = Date.now();
    return '\n start: '+ start + ', finish: ' + Date.now() + ', request: ' + countRequest + ', commit: ' + countCommit;
}

let close = (callback) => {
   
    console.log('All connections closed');
    server.close(callback);
    console.log('Server terminated');
};