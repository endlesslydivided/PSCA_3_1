const rpcWSS = require('rpc-websockets').Server;

let server = new rpcWSS(
    {
        port:4000,
        host:'localhost'
    }
);

server.setAuth(
    credentials=>
    credentials.login === 'admin' &&
    credentials.password === 'admin'
);

server.register('square',(params)=>
{
    if (params.length === 1) return Math.PI * Math.pow(params[0], 2);
    else if (params.length === 2) return params[0] * params[1];
    else return 0;
}).public();

server.register('sum', params => params.reduce((a, b) => a + b, 0)).public();
server.register('mul', params => params.reduce((a, b) => a * b, 1)).public();

function fib(n)
{
    let currentSize = 0;
    let numbers = [];
    let curr = 1;
    let next = 0;
    while (currentSize < n)
    {
        numbers.push(curr + next);
        next += curr;
        curr = next - curr;
        currentSize++;
    }
    return numbers;
}

server.register('fib', (param)=>{
    if(param.length === 1)
    {
        console.log(param);
        return fib(param);
    }
    else
    {
        return[1];
    }
}).protected();

function factorial(n)
{
    return (n!==1 || n!==0) ? n * factorial(n-1) : 1;
}

server.register('fact',(param)=>{
    if(param.length === 1)
    {
        console.log(param);
        return factorial(param);
    }
    else
    {
        return [1]
    }
}).protected();

process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
  });