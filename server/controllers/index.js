const validWord = require('../services/validWord');
const router = require('express').Router();
const path = require('path');
const auth = require('../middlewares/auth');
const Room = require('../models/room');
const { emitRooms, disconnectSocket, closeRoom, disconnectAllSockets } = require('../services/socket');

let currentUsers = [];
let db;

if (process.env.NODE_ENV === 'testing') {
    db = require('../queries/testqueries');
} else {
    db = require('../queries/queries');
}

router.use('/api/room', require('./rooms'));

/* Check if player is logged in */
router.get('/auth', (req, res) => {
    const { user } = req.session;
    if (user) { /* The user session exists, authorised */
        res.status(200).json({ cookie: user.username });
    } else { /* The user session does not exist, unauthorised */
        res.status(401).json({ message: "You need to log in with a username to enter the game."});
    }
});

/* Log in the user */
router.post('/auth/login', (req, res) => {
    const { username } = req.body;
    db.get(username).then((user => {
        if (!user) {
            // TODO: Add this when we add authentication
            // res.status(409).json({message: "Username already exists."});
            try {
                db.add(username).then((id) => {
                    req.session.user = { username, id};
                    req.session.roomId = null;
                    currentUsers.push({ username });
                    res.sendStatus(200);
                });
            } catch (err) {
                console.log(err);
                res.status(400).json({ message: err.message });
            }  
        } else {
            req.session.roomId = null;
            currentUsers.push({ username });
            req.session.user = { username: user.name, id: user.id }
            res.sendStatus(200);
        }
    }));        
});

/* Log out the user */
router.post('/auth/logout', auth, (req, res) => {
    const { user, roomId } = req.session;
    try {
        if (roomId !== null) {
            const room = Room.getById(roomId);
            if (room) Room.removePlayer(room, user.username);
            emitRooms();
        }
        disconnectSocket(user.username);
        req.session.destroy();
        currentUsers = currentUsers.filter((otherUser) => otherUser.username !== user.username);
        res.sendStatus(200);
    } catch (err) {
        console.log(err);
        res.status(400).json({message: err.message});
    }
});

/* Get the players list of cards */
router.get('/api/cards', auth, (req, res) => {
    const { user, roomId } = req.session;
    const gameState = Room.getById(roomId).gameState;
    const cards = gameState.getUnplayedCardsByUsername(user.username);
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
        const gameState = Room.getById(roomId).gameState;
        db.updateScores(gameState.getPlayers()).then((user) => {
            gameState.endGame();
            Room.deleteById(roomId);
            closeRoom(roomId);
            res.sendStatus(200);
        });
    } catch (err) {
        res.status(400).json({message: err.message});
    }
});

/* Current player plays a card and a word */
router.post('/api/play-card-word', auth, (req, res) => {
    const { user, roomId } = req.session;
    const { word, cardId } = req.body;
    if (Room.getById(roomId).gameState.isCurrentPlayer(user.username)) { /* Only current player is allowed to play both a word and a card */
        try {
            if (validWord.isValidWord(word)) {
                Room.getById(roomId).gameState.playCardAndWord(user.username, cardId, word); 
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

/* Player plays a card */
router.post('/api/play-card', auth, (req, res) => {
    const { user, roomId } = req.session;
    const { cardId } = req.body;
    try {
        Room.getById(roomId).gameState.playCard(user.username, cardId)
        res.sendStatus(200);
    } catch (err) { /* Player attempts to vote for a card again or game status is not appropriate */
        res.status(400).json({ message: err.message});
    }
});

/* Player votes for a card */
router.post('/api/vote-card', auth, (req, res) => {
    const { user, roomId } = req.session;
    const { cardId } = req.body;
    if (!Room.getById(roomId).gameState.isCurrentPlayer(user.username)) { /* Any user apart from the current player is allowed to vote for a card */
        try {
            Room.getById(roomId).gameState.voteCard(user.username, cardId)
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
router.get('/api/game-state', auth, (req, res) => {
    const { user, roomId } = req.session;        
    try {
        const currentGameState = Room.getById(roomId).gameState.getState(user.username);
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
