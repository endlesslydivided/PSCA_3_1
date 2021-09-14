const express = require('express');
const bodyParser = require('body-parser');
const DataBase = require('./db/DataBase');

const HOST = 'localhost';
const PORT = 5000;

const app = express();
const db = new DataBase(DataBase.names());

app.use(bodyParser.json());
app.use(express.static('.'));

db.on('get', async (request, response) => {
    await response.json(await db.getRows());
    console.log("DB get");
});

db.on('post', async (request, response) => {
    let newObject = {
        name: request.query.name,
        birth: request.query.birth
    } = request.body;
    await response.json(await db.addRow(newObject));
    console.log("DB post");
});

db.on('put', async (request, response) => {
    let object = 
    {
        id: request.query.id,
        name: request.query.name,
        birth: request.query.birth
    } = request.body;
    await response.json(await db.updateRow(object));
    console.log("DB put");
});

db.on('delete', async (request, response) => {
    await response.json(await db.removeRow(request.query.id));
    console.log("DB delete");
});

db.on('commit', async (request, response) => {
    await response.json(await db.stCommit());
    console.log("DB commit");
});

app.get('/api/ss', (request, response) => {
    if(finish == 0)
    {
      response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
      response.end('Сбор статистики еще не завершен');
    }
    else
    {
      response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
      response.end(JSON.stringify({ Start: St1, Finish: finish, Commit: Comm, Statistic: Stat }));
    }
    console.log("Open statistic");
  
  });
  
app.get('/commit', (request, response) => {
      db.emit('commit', request, response);
      console.log("App commit");
});
  
app.get('/api/db', (request, response) => {
      db.emit('get', request, response);
      console.log("App get");
});

app.post('/api/db', (request, response) => {
      db.emit('post', request, response);
      console.log("App post");
});

app.put('/api/db', (request, response) => {
      db.emit('put', request, response);
      console.log("App put");
});
  
app.delete('/api/db', (request, response) => {
      db.emit('delete', request, response);
      console.log("App delete");
});

app.listen(PORT, HOST, () => {
    const URL = `http://${HOST}:${PORT}`;
    console.log('Listening on ' + URL);
});