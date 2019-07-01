const express = require('express');
const session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookie = require('cookie');
const gameLogic = require('./gameLogic');
const cookieParser = require('cookie-parser')

const cardManager = require('./cards');

const sampleArray = ['Hello', 'World', '!'];

module.exports = port => {
  const app = express();
  const server = require('http').createServer(app);
  const io = require('socket.io')(server);

  app.use(express.static('build'));
  app.use(bodyParser.json());
  app.use(cors());
  app.use(cookieParser());
  app.use(session({
    name: 'username',
    secret: 'my-cool-secret',
    resave: false,
    saveUninitialized: false,
    secure: true,
    cookie: {
      maxAge: 1800000
    }
  }))

  server.listen(port, () => console.log(`Server running on port: ${port}`));

  // Send index file
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../build/index.html'), (err) => {
      if (err) {
        res.status(500);
        res.send(err);
      }
    });
  });

  // Start the game
  app.get('/api/start', (req, res) => {
    gameLogic.initGame();
    const roundInfo = {
        currentPlayer: gameLogic.getCurrentPlayer()
    }
    io.emit("startRound", roundInfo);
    res.status(200);
  });

  // End your turn
  app.get('/api/endTurn', (req, res) => {
    // Use cookie to decide which player sent the request
    console.log("endTurn");
    console.log(req.cookies);
    // End their turn
    // If last player, go next turn
  });

  // Socket.io
  io.on('connection', function (socket) {
    console.log("Someone connected.");
    emitAllPlayers();
  });

  app.get('/auth', (request, response) => {
    if (request.session.user) {
      response.sendStatus(200);
    } else {
      response.sendStatus(404);
    }
  });

  /* Send a random set of cards to user */
  app.get('/api/cards', (req, res) => {
    if (req.session.user) {
      var indexedBy = req.session.user;    
      var user = currentUsers.find((user) => user.username === indexedBy);    
      res.status(200).json(user.cards);
    } else {
      res.sendStatus(404);
    }
  });
  
  var currentUsers = [];

  /* Log in the user */
  app.post('/auth/login', (req, res) => {
    var user = currentUsers.find((user) => user.username === req.body.username);
    if (!user) {
      req.session.user = req.body.username;
      var newSet = cardManager.assign(currentUsers, 3 /* number of cards per user */);
      currentUsers.push({
        username: req.body.username,
        cards: newSet,
        isMyTurn: false,
        score: 0
      });
      res.sendStatus(200);
    } else {
      res.status(405).json({message: "User already exists"});
    }
  });

  /* SOCKETIO HELPERS */
  const emitAllPlayers = () => {
    io.emit("players", gameLogic.getPlayers());
  }
}

