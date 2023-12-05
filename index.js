const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');

const { Cross, Zero, Cell, Field, Session, Game } = require('./controllers/game.js');


// const http = require('node:http');
// const { requestListner } = require('./static/requests.js');

const game = new Game();

const hostname = '127.0.0.1';
const port = 3001;

const app = express();

// app.set('view engine', 'html');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
  secret: 'you secret key',
  saveUninitialized: true,
  resave: true
}));


//-------Pages-----------------------
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/views/index.html"));
});

app.get("/game:id", (req, res) => {
  // res.render(__dirname + "/public/views/game");
  res.sendFile(path.join(__dirname + "/views/game.html"));
});

//-------Another-requests------------
app.post("/createSession", (req, res) => {
  const sessionId = game.createNewSession(req.sessionID);

  data = {
      "id": sessionId
  };

  res.setHeader('Content-Type', "application/json");
  res.writeHead(200);
  return res.end(JSON.stringify(data));
});

app.get("/getSessionsList", (req, res) => {
  data = {
    "sessions": game.sessions
  };

  res.setHeader('Content-Type', "application/json");
  res.writeHead(200);
  return res.end(JSON.stringify(data));
});

//-------------Test------------------

app.get('/listUpdate', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Cache-Control', 'no-cache');
  // res.set('Access-Control-Allow-Origin', '*');
  console.log(`${req.sessionID}: Connection opened`);

  let timer = setInterval(() => {
    res.status(200);
    data = {
      "sessions": game.sessions
    };
    res.write(`data: ${JSON.stringify(data)}\n\n`);
    // console.log("data", data);
  }, 1000);

  // game.response = res;
  req.on('close', () => {
    console.log(`${req.sessionID}: Connection closed`);
    clearInterval(timer);
    res.end();
    return;
  })
});

//-----------------------------------

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});