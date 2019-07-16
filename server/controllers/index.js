const router = require('express').Router();
const path = require('path');
const auth = require('../services/auth');
const gameLogic = require('../services/gameLogic');
const closeSocket = require('../services/socket').closeSocket;

let currentUsers = [];

/* Check if player is logged in */
router.get('/auth', (req, res) => {
    if (req.session.user) { /* The user session exists, authorised */
        res.status(200).json({ cookie: req.session.user });
    } else { /* The user session does not exist, unauthorised */
        res.status(401).json({ message: "You need to log in with a username to enter the game."});
    }
});

/* Log in the user */
router.post('/auth/login', (req, res) => {
    const user = currentUsers.find((user) => user.username === req.body.username);
    if (!user) { /* User does not already exist */
        req.session.user = req.body.username;            
        const user = {
            username: req.body.username
        };        
        if (gameLogic.canJoinGame(user.username)) { /* Game has not been started yet */
            currentUsers.push(user);
            gameLogic.joinGame(user, () => {
                res.sendStatus(200);
            });
        } else { /* Game has already began */
            res.status(400).json({message: "Game has already started."});
        }
    } else { /* Username is taken, conflict error */
        res.status(409).json({message: "Username already exists."});
    }    
});

/* Log out the user */
router.get('/auth/logout', auth, (req, res) => {
    if (gameLogic.quitGame(user)) { /* Game has finished, or has not been started yet */
        currentUsers = currentUsers.filter((otherUser) => otherUser !== user);
        req.session.destroy();
        gameLogic.removePlayer(user.username);
        res.sendStatus(200);
    } else { /* Game has started, method not allowed */
        res.status(400).json({message: "Cannot log out of a running game."});
    }
});

/* Get the players list of cards */
router.get('/api/cards', auth, (req, res) => {
    const cards = gameLogic.getUnplayedCardsByUsername(req.session.user);
    if (cards) res.status(200).json(cards);
    else res.status(404).json({message: "Cannot find cards: user does not exist."});
});

/* Start the game */
router.get('/api/start', auth, (req, res) => {
    if (gameLogic.startGame()) {
        res.sendStatus(200);
    } else {
        res.status(400).json({message: "Cannot start game. Insufficient number of players"});
    }
});

/* End the game */
router.get('/api/end', auth, (req, res) => {
    if (gameLogic.endGame()) {
        currentUsers = [];
        closeSocket();
        res.sendStatus(200);
    } else {
        res.status(400).json({message: "Cannot end game. Game is currently running"});
    }
});

/* Resest the cookie and destroy the session */
router.get('/api/reset-cookie', auth, (req, res) => {
    if (req.session) {
        req.session.destroy();
        res.sendStatus(200);
    } else {
        res.status(400).json({message: "Cannot destroy session as it does not exist"});
    }
});

/* Check if in dev mode, and enable end game request */
if (process.env.NODE_ENV === 'testing') {
    router.post('/api/reset-server', (req, res) => {
        currentUsers = []
        gameLogic.endGame();
        closeSocket();
        req.session.destroy();
        res.sendStatus(200);
    });
}

/* Current player plays a card and a word */
router.post('/api/playCardWord', auth, (req, res) => {
    if (gameLogic.isCurrentPlayer(req.session.user)) { /* Only current player is allowed to play both a word and a card */
        if (gameLogic.playCardAndWord(req.session.user, req.body.card, req.body.word)) {
            res.sendStatus(200);
        } else { /* Player attempts to vote for a card again or game status is not appropriate */
            res.status(400).json({ message: "You cannot play more than one card and one word, or now is not the right time to play a card and a word."});
        }
    } else { /* Current player attempts to vote for their card */
        res.status(400).json({ message: "You cannot play a word and a card when it is not your turn."});
    }
});

/* Player plays a card */
router.post('/api/playCard', auth, (req, res) => {
    if (gameLogic.playCard(req.session.user, req.body.card)) {
        res.sendStatus(200);
    } else { /* Player attempts to vote for a card again or game status is not appropriate */
        res.status(400).json({ message: "You cannot play more than one card, or now is not the right time to play a card."});
    }
});

/* Player votes for a card */
router.post('/api/voteCard', auth, (req, res) => {    
    if (!gameLogic.isCurrentPlayer(req.session.user)) { /* Any user apart from the current player is allowed to vote for a card */
        if (gameLogic.voteCard(req.session.user, req.body.card)) {
            res.sendStatus(200);
        } else { /* Player attempts to vote for a card again or game status is not appropriate */
            res.status(400).json({ message: "You cannot vote for a card more than once, or now is not the right time to vote."});
        }
    } else { /* Current player attempts to vote for their card */
        res.status(400).json({ message: "You cannot vote for a card when it is your turn."});
    }
});

/* Send index file */
router.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../build/index.html'), (err) => {
        if (err) {
            res.status(500);
            res.send(err);
        }
    });
});

module.exports = router;
