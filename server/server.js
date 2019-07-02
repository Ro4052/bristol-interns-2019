const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookie = require('cookie');
const gameLogic = require('./gameLogic');
const cookieParser = require('cookie-parser')
const cardManager = require('./cards');

module.exports = port => {
    const app = express();
    const server = require('http').createServer(app);
    const io = require('socket.io')(server);

    app.use(express.static('build'));
    app.use(bodyParser.json());
    app.use(cors());
    app.use(cookieParser())

    server.listen(port, () => console.log(`Server running on port: ${port}`));

    var currentUsers = [];

    // Send index file
    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, '../build/index.html'), (err) => {
            if (err) {
                res.status(500);
                res.send(err);
            }
        });
    });

    // Get cards
    app.get('/api/cards', (req, res) => {
        if (currentUsers.length > 0) {
            var indexedBy = req.cookies.username.split('=')[0];    
            var user = currentUsers.find((user) => user.username === indexedBy);    
            res.status(200).json(user.cards);
        } else {
            res.sendStatus(404);
        }
    });

    // Log in the user
    app.post('/auth/login', (req, res) => {
        var user = currentUsers.find((user) => user.username === req.body.username);
        if (!user) {
            res.cookie(cookie.serialize('username', req.body.username), {
                httpOnly: true,
                expires: (10 * 365 * 24 * 60 * 60)
            });
            var newSet = cardManager.assign(currentUsers, 3 /* number of cards per user */);
            let user = {
                username: req.body.username,
                cards: newSet,
                isMyTurn: false,
                score: 0
            };
            currentUsers.push(user);
            gameLogic.joinGame(user);
            emitGameState();
            res.sendStatus(200);
        } else {
            res.sendStatus(405);
        }
    });

    // Start the game
    app.get('/api/start', (req, res) => {
        gameLogic.initGame();
        emitGameState();
        res.sendStatus(200);
    });

    // End your turn
    app.get('/api/endTurn', (req, res) => {
        const indexedBy = req.cookies.username.split('=')[0];    
        const player = currentUsers.find((player) => player.username === indexedBy);
        // End their turn
        gameLogic.endPlayerTurn(player);
        // If last player, go next turn
        if (gameLogic.allPlayersFinishedTurn()) {
            console.log("End of round!");
            gameLogic.incrementRound();
            emitGameState();
        }
        res.sendStatus(200);
    });

    /* SOCKET */

    let sockets = []

    // Setup connection
    io.on('connection', function (socket) {
        console.log("Someone connected.");
        sockets.push(socket);
        emitGameState();
    });

    // Whenever a change is made to the game state, emit it
    const emitGameState = () => {
        io.emit("players", gameLogic.getGameState());
    }

}

