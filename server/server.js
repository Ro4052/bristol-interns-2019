const express = require('express');
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
  app.use(cookieParser())

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

  // REST example
  app.get('/api/cards', (req, res) => {
    if (currentUsers.length > 0) {
      var indexedBy = req.cookies.username.split('=')[0];    
      var user = currentUsers.find((user) => user.username === indexedBy);    
      res.status(200).json(user.cards);
    } else {
      res.sendStatus(404);
    }
  });
  
  var currentUsers = [];

  // Log in the user
  app.post('/auth/login', (req, res) => {
    var user = currentUsers.find((user) => user.username === req.body.username);
    if (!user) {
      res.cookie(cookie.serialize('username', req.body.username), {
        httpOnly: true,
        expires: (10 * 365 * 24 * 60 * 60)
      });
      var newSet = cardManager.assign(currentUsers, 3 /* number of cards per user */);
      currentUsers.push({
        username: req.body.username,
        cards: newSet,
        isMyTurn: false,
        score: 0
      });
      res.sendStatus(200);
    } else {
      req.sendStatus(405);
    }
  });

  // Socket.io
  io.on('connection', function (socket) {
    console.log("Someone connected.");
  });
  
}

