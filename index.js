const http = require('node:http');
const { requestListner } = require('./static/requests.js');

const hostname = '127.0.0.1';
const port = 3001;

const server = http.createServer(requestListner);
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});