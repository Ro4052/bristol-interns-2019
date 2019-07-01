const express = require('express');
const session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookie = require('cookie');
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

  // REST example
  app.get('/api/hello', (request, response) => {
    response.json(sampleArray);
  });

  app.get('/auth', (request, response) => {
    if (request.session.user) {
      response.sendStatus(200);
    } else {
      response.sendStatus(404);
    }
  });

  // REST example
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

  // Log in the user
  app.post('/auth/login', (req, res) => {
    console.log("logging");
    
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
      res.sendStatus(405);
    }
  });

  // Socket.io
  io.on('connection', function (socket) {
    console.log("Someone connected.");
  });
  
}

