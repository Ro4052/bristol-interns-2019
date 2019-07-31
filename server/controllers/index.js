const validWord = require('../services/validWord');
const router = require('express').Router();
const path = require('path');
const auth = require('../middlewares/auth');
const Room = require('../models/room');
const { emitRooms, disconnectSocket, closeRoom, disconnectAllSockets } = require('../services/socket');

let currentUsers = [];

router.use('/api/room', require('./rooms'));

/* Check if player is logged in */
router.get('/auth', (req, res) => {
    const { user } = req.session;
    if (user) { /* The user session exists, authorised */
        res.status(200).json({ cookie: user });
    } else { /* The user session does not exist, unauthorised */
        res.status(401).json({ message: "You need to log in with a username to enter the game."});
    }
});

/* Log in the user */
router.post('/auth/login', (req, res) => {
    const { username } = req.body;
    if (currentUsers.find((user) => user.username === username)) {
        res.status(409).json({message: "Username already exists."});
    } else {
        req.session.user = username;
        req.session.roomId = null;
        currentUsers.push({ username });
        res.sendStatus(200);
    }
});

/* Log out the user */
router.post('/auth/logout', auth, (req, res) => {
    const { user, roomId } = req.session;
    try {
        if (roomId !== null) {
            const room = Room.getById(roomId);
            if (room) Room.removePlayer(room, user);
        }
        disconnectSocket(user);
        req.session.destroy();
        currentUsers = currentUsers.filter((otherUser) => otherUser.username !== user);
        res.sendStatus(200);
    } catch (err) {
        console.log(err);
        res.status(400).json({message: err.message});
    }
});

/* Get the players list of cards */
router.get('/api/cards', auth, (req, res) => {
    const gameState = Room.getById(req.session.roomId).gameState;
    const cards = gameState.getUnplayedCardsByUsername(req.session.user);
    if (cards) {
        res.status(200).json(cards);
    }
    else {
        res.status(404).json({message: "Cannot find cards: user does not exist."});
    }
});

/* Start the game */
router.get('/api/start', auth, (req, res) => {
    try {
        const roomId = req.session.roomId;
        Room.getById(roomId).gameState.startGame();
        emitRooms();
        res.sendStatus(200);
    } catch (err) {
        console.log(err);
        res.status(400).json({message: err.message});
    }
});

/* End the game */
router.get('/api/end', auth, (req, res) => {
    const { roomId } = req.session;
    try {
        const gameState = Room.getById(req.session.roomId).gameState;
        gameState.endGame();
        Room.deleteById(roomId);
        closeRoom(roomId);
        res.sendStatus(200);
    } catch (err) {
        res.status(400).json({message: err.message});
    }
});

/* Current player plays a card and a word */
router.post('/api/playCardWord', auth, (req, res) => {
    if (Room.getById(req.session.roomId).gameState.isCurrentPlayer(req.session.user)) { /* Only current player is allowed to play both a word and a card */
        try {
            if (validWord.isValidWord(req.body.word)) {
                Room.getById(req.session.roomId).gameState.playCardAndWord(req.session.user, req.body.cardId, req.body.word); 
                res.sendStatus(200);
            } else { 
                res.status(400).json({message: "Invalid word."});
            }
        } catch (err) { /* Player attempts to vote for a card again or game status is not appropriate */
            console.log(err);
            res.status(400).json({ message: err.message});
        }
    } else { /* Current player attempts to vote for their card */
        res.status(400).json({ message: "You cannot play a word and a card when it is not your turn."});
    }
});

/* Current player plays word only if it's a valid word */
router.post('/api/validWord', auth, (req,res) => {
    if (validWord.isValidWord(req.body.word)) {
        res.sendStatus(200);
    } else {
        res.status(400).json({message: "Invalid word"});
    }
});

/* Player plays a card */
router.post('/api/playCard', auth, (req, res) => {
    try {
        Room.getById(req.session.roomId).gameState.playCard(req.session.user, req.body.cardId)
        res.sendStatus(200);
    } catch (err) { /* Player attempts to vote for a card again or game status is not appropriate */
        res.status(400).json({ message: err.message});
    }
});

/* Player votes for a card */
router.post('/api/voteCard', auth, (req, res) => { 
    if (!Room.getById(req.session.roomId).gameState.isCurrentPlayer(req.session.user)) { /* Any user apart from the current player is allowed to vote for a card */
        try {
            Room.getById(req.session.roomId).gameState.voteCard(req.session.user, req.body.cardId)
            res.sendStatus(200);
        } catch (err) { /* Player attempts to vote for a card again or game status is not appropriate */
            console.log(err);
            res.status(400).json({ message: err.message});
        }
    } else { /* Current player attempts to vote for their card */
        res.status(400).json({ message: "You cannot vote for a card when it is your turn."});
    }
});

/* Player refreshes the page and asks for the current game state */
router.get('/api/gameState', auth, (req, res) => {
    try {
        const currentGameState = Room.getById(req.session.roomId).gameState.getState(req.session.user);
        res.status(200).json({ currentGameState });
    } catch (err) { /* Player attempts to vote for a card again or game status is not appropriate */
        res.status(400).json({ message: err.message });
    }
});

/* Check if in dev mode, and enable end game request */
if (process.env.NODE_ENV === 'testing') {
    router.post('/api/reset-server', (req, res) => {
        currentUsers = [];
        disconnectAllSockets();
        Room.reset();
        req.session.destroy();
        res.sendStatus(200);
    });
}

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
