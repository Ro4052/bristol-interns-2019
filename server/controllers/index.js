const router = require('express').Router();
const path = require('path');
const auth = require('../services/auth');
const gameLogic = require('../services/gameLogic');
const cardManager = require('../services/cards');

let currentUsers = [];

/* Check if player is logged in */
router.get('/auth', (req, res) => {
    if (req.session.user) {
        res.sendStatus(200);
    } else {
        res.sendStatus(401);
    }
});

/* Log in the user */
router.post('/auth/login', (req, res) => {
    const user = currentUsers.find((user) => user.username === req.body.username);
    if (!user) {
        req.session.user = req.body.username;            
        const newSet = cardManager.assign(currentUsers, 3 /* number of cards per user */);
        const user = {
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
    const user = currentUsers.find((user) => user.username === req.session.user);
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

/* Send a random set of cards to user */
router.get('/api/cards', auth, (req, res) => {
    const user = currentUsers.find((user) => user.username === req.session.user);    
    res.status(200).json(user.cards);
});

/* Start the game */
router.get('/api/start', auth, (req, res) => {
    gameLogic.startGame();
    res.sendStatus(200);
});

/* Current player plays a card and a word */
router.post('/api/playCardWord', auth, (req, res) => {
    gameLogic.playCardAndWord(req.session.user, req.body.card, req.body.word);
    res.sendStatus(200);
});

/* Current player plays a card and a word */
router.post('/api/playCard', auth, (req, res) => {
    gameLogic.playCard(req.session.user, req.body.card);
    res.sendStatus(200);
});

/* Send index file */
router.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build/index.html'), (err) => {
        if (err) {
            res.status(500);
            res.send(err);
        }
    });
});

module.exports = router;
