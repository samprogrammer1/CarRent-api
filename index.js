const http = require('http');
const route = require('./route');
const port = process.env.PORT || 3000;

const server = http.createServer(route);

server.listen(port,console.log("app is runing"));