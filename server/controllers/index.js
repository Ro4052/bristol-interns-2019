const profanityCheck = require('../services/profanityCheck');
const router = require('express').Router();
const path = require('path');
const auth = require('../services/auth');
const gameLogic = require('../services/gameLogic');
const closeSocket = require('../services/socket').closeSocket;

let currentUsers = [];

/* Check if player is logged in */
router.get('/auth', (req, res) => {
    if (req.session.user) {
        res.status(200).json({ cookie: req.session.user });
    } else {
        res.sendStatus(401);
    }
});

/* Log in the user */
router.post('/auth/login', (req, res) => {
    const user = currentUsers.find((user) => user.username === req.body.username);
    if (!user) {
        req.session.user = req.body.username;            
        const user = {
            username: req.body.username
        };        
        if (gameLogic.canJoinGame(user.username)) {
            currentUsers.push(user);
            gameLogic.joinGame(user, () => {
                res.sendStatus(200);
            });
        } else {
            res.status(400).json({message: "Game has already started"});
        }
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
            gameLogic.removePlayer(user.username);
            res.sendStatus(200);
        } else {
            res.sendStatus(400)
        }
    } else {
        res.status(404).json({message: "Cannot log out: user does not exist."});
    }
});

/* Get the players list of cards */
router.get('/api/cards', auth, (req, res) => {
    const cards = gameLogic.getUnplayedCardsByUsername(req.session.user);
    res.status(200).json(cards);
});

/* Start the game */
router.get('/api/start', auth, (req, res) => {
    gameLogic.startGame();
    res.sendStatus(200);
});

/* End the game */
router.get('/api/end', auth, (req, res) => {
    gameLogic.endGame();
    currentUsers = [];
    closeSocket();
    res.sendStatus(200);
});

/* Resest the cookie and destroy the session */
router.get('/api/reset-cookie', auth, (req, res) => {
    req.session.destroy();
    res.sendStatus(200);
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

/* Current player plays word only if it's a valid word */
router.post('/api/validWord', auth, (req,res) => {
    if (profanityCheck.isValidWord(req.body.word)) {
        console.log("Valid");
        res.sendStatus(200);
    } else {
        console.log("Invalid");
        res.status(400).json({message: "Invalid word"});
    }
})

/* Current player plays a card and a word */
router.post('/api/playCardWord', auth, (req, res) => {
    gameLogic.playCardAndWord(req.session.user, req.body.card, req.body.word);
    if (profanityCheck.isValidWord(req.body.word)) {
        console.log("Valid");
        res.sendStatus(200);
    } else {
        console.log("Invalid");
        res.status(400).json({message: "Invalid word"});
    }
});

/* Player plays a card */
router.post('/api/playCard', auth, (req, res) => {
    gameLogic.playCard(req.session.user, req.body.card);
    res.sendStatus(200);
});

/* Player votes for a card */
router.post('/api/voteCard', auth, (req, res) => {    
    if (!gameLogic.isCurrentPlayer(req.session.user)) {
        gameLogic.voteCard(req.session.user, req.body.card);
        res.sendStatus(200);
    } else {
        res.status(400).json({ message: "You cannot vote for a card when it's your turn"} );
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
