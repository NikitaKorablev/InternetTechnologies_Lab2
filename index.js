const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const cors = require('cors')

const { Game } = require('./controllers/game.js');

const game = new Game();

const hostname = '127.0.0.1';
const port = 3001;

const app = express();

// app.use(cors());
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
  try {
    const session_id = req.params.id.split(':')[1];
    game.findSession(session_id);
    const player_id = req.sessionID;
    game.addPlayer(session_id, player_id);

    // res.render(__dirname + "/public/views/game");
    res.sendFile(path.join(__dirname + "/views/game.html"));
  } catch (err) {
    console.error(err);
    res.writeHead(500);
    res.end();
  }
});

//-------Another-requests------------
app.post("/createSession", (req, res) => {
  const sessionId = game.createNewSession(req.sessionID);
  const data = { "id": sessionId };

  res.setHeader('Content-Type', "application/json");
  res.writeHead(200);
  return res.end(JSON.stringify(data));
});

app.post("/move", (req, res) => {
  // console.log(req.body);
  try {
    const session = game.getSession(req.body.game_id);
    session.move(req.body);
    res.writeHead(200);
    res.end();
  } catch (err) {
    console.error(err);
    res.writeHead(500);
    res.end();
  }
})

app.get("/getSessionsList", (req, res) => {
  const data = { "sessions": game.sessions };

  res.setHeader('Content-Type', "application/json");
  res.writeHead(200);
  return res.end(JSON.stringify(data));
});

app.get("/getField", (req, res) => {
  const player_id = req.sessionID;
  const session_id = game.getSessionId(player_id);
  const session = game.getSession(session_id);

  const myObj = session.getMyObj(player_id);
  const data = {
    "obj": myObj,
    "session_id": session_id,
    "field": session.getField(),
    "field_changes": session.getChanges(),
    "available_cells": session.getAvailableCells(myObj)
  };
  // console.log(data);

  res.setHeader('Content-Type', "application/json");
  res.status(200);
  res.end(JSON.stringify(data));
});

//-------------SSE-------------------
app.get('/listUpdate', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Cache-Control', 'no-cache');
  console.log(`${req.sessionID}: Start page opened`);

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
    console.log(`${req.sessionID}: Start page closed`);
    clearInterval(timer);
    res.end();
    return;
  })
});

app.get("/getChanges", (req, res) => {
  const player_id = req.sessionID;
  const session_id = game.getSessionId(player_id);
  const session = game.getSession(session_id);
  console.log(`${req.sessionID} is connected to the game.`);

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", true);

  session.playerConnect(player_id);
  let timer = setInterval(() => {
    const data = {"changes": session.getChanges()};

    res.status(200);
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  }, 1000);

  // game.response = res;
  req.on('close', () => {
    session.playerDisconnect(player_id);
    console.log(`${req.sessionID} is disconnected from the game.`);
    clearInterval(timer);
    res.end();
    return;
  })
});

//-----------------------------------



//-----------------------------------

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});