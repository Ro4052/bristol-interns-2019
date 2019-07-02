const express = require('express');
const sharedsession = require("express-socket.io-session");
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const gameLogic = require('./gameLogic');
const cookieParser = require('cookie-parser')
const cardManager = require('./cards');
const expressSession = require('express-session');

module.exports = port => {
    const app = express();
    const server = require('http').createServer(app);
    const io = require('socket.io')(server);

    app.use(express.static('build'));
    app.use(bodyParser.json());
    app.use(cors());
    app.use(cookieParser());
    var session = expressSession({
        name: 'username',
        secret: 'my-cool-secret',
        resave: false,
        saveUninitialized: false,
        secure: true
    });
    app.use(session);
    io.use(sharedsession(session));

    let currentUsers = [];
    server.listen(port, () => console.log(`Server running on port: ${port}`));

    /* Send index file */
    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, '../build/index.html'), (err) => {
        if (err) {
        res.status(500);
        res.send(err);
        }
        });
    });

    /* Check if player is logged in */
    app.get('/auth', (request, response) => {
        if (request.session.user) {
        response.sendStatus(200);
        } else {
        response.sendStatus(404);
        }
    });

    /* Get cards */
    app.get('/api/cards', (req, res) => {
        if (currentUsers.length > 0) {
        var indexedBy = req.session.user;    
        var user = currentUsers.find((user) => user.username === indexedBy);    
        res.status(200).json(user.cards);
        } else {
        res.sendStatus(404);
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

    /* Log in the user */
    app.post('/auth/login', (req, res) => {
        var user = currentUsers.find((user) => user.username === req.body.username);
        if (!user) {
        req.session.user = req.body.username;
        var newSet = cardManager.assign(currentUsers, 3 /* number of cards per user */);
        let user = {
            username: req.body.username,
            cards: newSet,
            finishedTurn: false,
            score: 0,
            cookie: req.headers.cookie
        };
        currentUsers.push(user);
        gameLogic.joinGame(user);
        emitGameState();
        res.sendStatus(200);
        } else {
        res.status(404).json({message: "User already exists"});
        }
    });

    /* Log out the user */
    app.post('/auth/logout', (req, res) => {
        var user = currentUsers.find((user) => user.username === req.session.user);
        if (user) {
            currentUsers = currentUsers.filter((otherUser) => otherUser !== user);
            gameLogic.quitGame(user);            
            emitGameState();
            req.session.destroy();
            res.sendStatus(200);
        } else {
            res.status(404).json({message: "Cannot log out: user does not exist."});
        }
    });

    /* Start the game */
    app.get('/api/start', (req, res) => {
        gameLogic.startGame();
        emitGameState();
        res.sendStatus(200);
    });

    /* Check if it's my turn */
    app.get('/api/myTurn', (req,res) => {
        var user = currentUsers.find((user) => user.username === req.session.user);
        var currentuser = gameLogic.getGameState().currentPlayer;
        if (user === currentuser) {
            res.sendStatus(200);
            emitGameState();
        }else {
            res.sendStatus(404);
        }
    })

    /* End your turn */
    app.get('/api/endTurn', (req, res) => {
        const username = req.session.user;    
        gameLogic.endPlayerTurn(username);
        emitGameState();
        res.sendStatus(200);
    });

    /* SOCKET */

    let sockets = [];
    let globalMessage = '';
    
    // Setup connection
    io.on('connection', function (socket) {
        sockets.push(socket);
        emitGameState();
        socket.on('private message', function (msg) {
            console.log('I received a private message saying ', msg);
            if (checkCurrentTurn(socket)) {
                globalMessage = msg;
                io.emit("messages", globalMessage);
            }        
        });
        socket.on('play card', (cardID) => {
            if (checkCurrentTurn(socket)) {
                gameLogic.playCard(cardID)
                emitGameState();
            }
        })
    });

    // Whenever a change is made to the game state, emit it
    const emitGameState = () => {
        io.emit("gameState", gameLogic.getGameState());
    }

    // Check if it's the sender's turn
    const checkCurrentTurn = (socket) => {
        if (gameLogic.getGameState().currentPlayer) {
            return (socket.handshake.session.user === gameLogic.getGameState().currentPlayer.username)
        } else {
            return false;
        }
    }
}

