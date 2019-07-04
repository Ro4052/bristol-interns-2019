const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const gameLogic = require('./gameLogic');
const cookieParser = require('cookie-parser')
const cardManager = require('./cards');
const expressSession = require('express-session');
const socket = require('./socket');

module.exports = port => {
    const app = express();
    const server = require('http').createServer(app);
    
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
    
    socket.setupSocket(server, session);

    let currentUsers = [];
    server.listen(port, () => console.log(`Server running on port: ${port}`));

    /* Check if player is logged in */
    app.get('/auth', (request, response) => {
        if (request.session.user) {
            response.sendStatus(200);
        } else {
            response.sendStatus(400);
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
                cookie: req.headers.cookie // Remove soon
            };
            currentUsers.push(user);
            gameLogic.joinGame(user);
            socket.emitGameState();
            res.sendStatus(200);
        } else {
            res.sendStatus(400);
        }
    });

    /* Log out the user */
    app.post('/auth/logout', (req, res) => {
        var user = currentUsers.find((user) => user.username === req.session.user);
        if (user) {
            currentUsers = currentUsers.filter((otherUser) => otherUser !== user);
            if (gameLogic.quitGame(user)) {
                socket.emitGameState();
                req.session.destroy();
                res.sendStatus(200);
            } else {
                res.sendStatus(400)
            }
        } else {
            res.status(404).json({message: "Cannot log out: user does not exist."});
        }
    });

    /* Start the game */
    app.get('/api/start', (req, res) => {
        gameLogic.startGame();
        socket.emitGameState();
        res.sendStatus(200);
    });

    /* Check if it's my turn */
    app.get('/api/myTurn', (req,res) => {
        var user = currentUsers.find((user) => user.username === req.session.user);
        var currentuser = gameLogic.getGameState().currentPlayer;
        if (user === currentuser) {
            res.status(200).json({myTurn: true});
        } else {
            res.status(200).json({myTurn: false});
        }
    })

    /* End your turn */
    app.get('/api/endTurn', (req, res) => {
        const username = req.session.user;    
        gameLogic.endPlayerTurn(username);
        socket.emitGameState();
        res.sendStatus(200);
    });

    /* DEFAULT Send index file */
    app.get('/*', (req, res) => {
        res.sendFile(path.join(__dirname, '../build/index.html'), (err) => {
            if (err) {
                res.status(500);
                res.send(err);
            }
        });
    });
}
