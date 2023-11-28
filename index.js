const http = require('node:http');
const fs = require('fs');
const hostname = '127.0.0.1';
const port = 3001;

const server = http.createServer((req, res) => {
  fs.readFile('index.html', (err, data) => {
    if (err) {
        res.writeHead(500);
        res.end(err);
    } else {
        res.setHeader('Content-Type', 'text/html');
        res.writeHead(200);
        res.end(data);
    }
  })
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});