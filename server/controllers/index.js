const router = require('express').Router();
const path = require('path');

const gameLogic = require('../services/gameLogic');
const cardManager = require('../services/cards');

let currentUsers = [];

/* Check if player is logged in */
router.get('/auth', (request, response) => {
    if (request.session.user) {
        response.status(200).json({loggedIn: true});
    } else {
        response.status(200).json({loggedIn: false});
    }
});

/* Get cards */
router.get('/api/cards', (req, res) => {
    if (currentUsers.length > 0) {
    var indexedBy = req.session.user;    
    var user = currentUsers.find((user) => user.username === indexedBy);    
        res.status(200).json(user.cards);
    } else {
        res.sendStatus(404);
    }
});

/* Send a random set of cards to user */
router.get('/api/cards', (req, res) => {        
    if (req.session.user) {
    var indexedBy = req.session.user;    
    var user = currentUsers.find((user) => user.username === indexedBy);    
        res.status(200).json(user.cards);
    } else {
        res.sendStatus(401);
    }
});

/* Log in the user */
router.post('/auth/login', (req, res) => {
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
        res.sendStatus(200);
    } else {
        res.sendStatus(409);
    }
});

/* Log out the user */
router.post('/auth/logout', (req, res) => {
    var user = currentUsers.find((user) => user.username === req.session.user);
    if (user) {
        currentUsers = currentUsers.filter((otherUser) => otherUser !== user);
        if (gameLogic.quitGame(user)) {
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
router.get('/api/start', (req, res) => {
    gameLogic.startGame();
    res.sendStatus(200);
});

/* Check if it's my turn */
router.get('/api/myTurn', (req,res) => {
    var user = currentUsers.find((user) => user.username === req.session.user);
    var currentuser = gameLogic.getGameState().currentPlayer;
    if (user === currentuser) {
        res.status(200).json({myTurn: true});
    } else {
        res.status(200).json({myTurn: false});
    }
})

/* End your turn */
router.get('/api/endTurn', (req, res) => {
    const username = req.session.user;
    gameLogic.endPlayerTurn(username);
    res.sendStatus(200);
});

/* DEFAULT Send index file */
router.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build/index.html'), (err) => {
        if (err) {
            res.status(500);
            res.send(err);
        }
    });
});

module.exports = router;