const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookie = require('cookie');
const gameLogic = require('./gameLogic');

module.exports = port => {
  const app = express();
  const server = require('http').createServer(app);
  const io = require('socket.io')(server);

  app.use(express.static('build'));
  app.use(bodyParser.json());
  app.use(cors());

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

  // Log in the user
  app.post('/auth/login', (req, res) => {
    res.cookie(cookie.serialize('username', req.body.username), {
      httpOnly: true,
      expires: (10 * 365 * 24 * 60 * 60)
    })
    gameLogic.joinGame(req.body.username);
    emitAllPlayers();
    res.status(200).json("Logged in");
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

  /* SOCKETIO HELPERS */
  const emitAllPlayers = () => {
    io.emit("players", gameLogic.getPlayers());
  }

}
