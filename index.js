const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');

const { Game } = require('./controllers/game.js');


// const http = require('node:http');
// const { requestListner } = require('./static/requests.js');

const game = new Game();

const hostname = '127.0.0.1';
const port = 3001;

const app = express();

app.set('view engine', 'html');

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

  const data = {
      "id": sessionId
  };

  res.setHeader('Content-Type', "application/json");
  res.writeHead(200);
  return res.end(JSON.stringify(data));
});

// app.post("/set2ndPlayer", (req, res) => {
//   const player = req.sessionID;
//   const session_id = req.body.session_id;

//   try {
//     game.addSecondPlayer(session_id, player);
//   } catch (error) {
//     console.error("Error: ", error);
//   }
  
//   res.writeHead(200);
//   return res.end();
// })

app.get("/getSessionsList", (req, res) => {
  const data = {
    "sessions": game.sessions
  };

  res.setHeader('Content-Type', "application/json");
  res.writeHead(200);
  return res.end(JSON.stringify(data));
});

//-------------SSE-------------------

app.get("/getField", (req, res) => {
  console.log("\n\n");

  const player_id = req.sessionID;
  const session_id = game.getSessionId(player_id);
  console.log("id: ", player_id);

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Cache-Control', 'no-cache');

  let timer = setInterval(() => {
    res.status(200);
    data = {
      "field": game.getSession(session_id).getField()
    };
    res.write(`data: ${JSON.stringify(data)}\n\n`);
    // console.log("data", data);
  }, 1000);

  // game.response = res;
  req.on('close', () => {
    clearInterval(timer);
    res.end();
    return;
  })
});

app.get('/listUpdate', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Cache-Control', 'no-cache');
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



//-----------------------------------

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});