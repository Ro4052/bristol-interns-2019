const validWord = require('../services/validWord');
const router = require('express').Router();
const path = require('path');
const auth = require('../services/auth');
const gameLogicClass = require('../services/gameLogicClass');
const closeSocket = require('../services/socket').closeSocket;
const createRoom = require('../services/socket').createRoom;

let currentUsers = [];
let roomId = 0;
/** @type {{ roomId: number, gameState: gameLogicClass }[]} */
let games = [];

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
    const user = currentUsers.find((user) => user.username === username);
    if (!user) { /* User does not already exist */
        req.session.user = req.body.username; 
        const user = { username };
        currentUsers.push(user);
        res.sendStatus(200);
    } else { /* Username is taken, conflict error */
        res.status(409).json({message: "Username already exists."});
    }
});

/* Log out the user */
router.get('/auth/logout', auth, (req, res) => {
    try { /* Game has finished, or has not been started yet */
        getGameStateById(req.session.roomId).quitGame(req.session.user);
        currentUsers = currentUsers.filter((otherUser) => otherUser.username !== req.session.user);
        getGameStateById(req.session.roomId).removePlayer(req.session.user);
        req.session.destroy();
        res.sendStatus(200);
    } catch (err) { /* Game has started, method not allowed */
        res.status(400).json({message: err.message});
    }    
});

/* Create a room (a single instance of a game) */
router.get('/api/room/create', auth, (req, res) => {
    const { user } = req.session;
    /* TODO: add check for when a room cannot be created and return an error */
    let newGameState = new gameLogicClass(roomId);
    let newGameRoom = {roomId, gameState: newGameState}
    createRoom(req.session.user, roomId, newGameState.getPlayers());
    games.push(newGameRoom);
    // Add the creator to the room
    if (newGameState.canJoinGame(user)) { /* Game has not been started yet */
        newGameState.joinGame(user, () => {
            req.session.roomId = roomId;    
            res.status(200).json({roomId: roomId});
            roomId++;
        });
    } else { /* Game has already began */
        res.status(400).json({message: "Game has already started."});
    }
});

/* Get the players list of cards */
router.get('/api/cards', auth, (req, res) => {
    const cards = getGameStateById(req.session.roomId).getUnplayedCardsByUsername(req.session.user);
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
        getGameStateById(req.session.roomId).startGame();
        res.sendStatus(200);
    } catch (err) {
        console.log(err);
        res.status(400).json({message: err.message});
    }
});

/* End the game */
router.get('/api/end', auth, (req, res) => {
    try {
        getGameStateById(req.session.roomId).endGame();
        currentUsers = [];
        closeSocket();
        res.sendStatus(200);
    } catch (err) {
        res.status(400).json({message: err.message});
    }
});

/* Reset the cookie and destroy the session */
router.get('/api/reset-cookie', (req, res) => {
    if (req.session) {
        req.session.destroy();
        res.sendStatus(200);
    } else {
        res.status(404).json({message: "Cannot destroy session as it does not exist"});
    }
});

/* Current player plays a card and a word */
router.post('/api/playCardWord', auth, (req, res) => {
    if (getGameStateById(req.session.roomId).isCurrentPlayer(req.session.user)) { /* Only current player is allowed to play both a word and a card */
        try {
            if (validWord.isValidWord(req.body.word)) {
                getGameStateById(req.session.roomId).playCardAndWord(req.session.user, req.body.cardId, req.body.word);                
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
})

/* Player plays a card */
router.post('/api/playCard', auth, (req, res) => {
    try {
        getGameStateById(req.session.roomId).playCard(req.session.user, req.body.cardId)
        res.sendStatus(200);
    } catch (err) { /* Player attempts to vote for a card again or game status is not appropriate */
        res.status(400).json({ message: err.message});
    }
});

/* Player votes for a card */
router.post('/api/voteCard', auth, (req, res) => { 
    if (!getGameStateById(req.session.roomId).isCurrentPlayer(req.session.user)) { /* Any user apart from the current player is allowed to vote for a card */
        try {
            getGameStateById(req.session.roomId).voteCard(req.session.user, req.body.cardId)
            res.sendStatus(200);
        } catch (err) { /* Player attempts to vote for a card again or game status is not appropriate */
            res.status(400).json({ message: err.message});
        }
    } else { /* Current player attempts to vote for their card */
        res.status(400).json({ message: "You cannot vote for a card when it is your turn."});
    }
});

/* Check if in dev mode, and enable end game request */
if (process.env.NODE_ENV === 'testing') {
    router.post('/api/reset-server', (req, res) => {
        currentUsers = [];
        getGameStateById(req.session.roomId).setStatus("GAME_OVER");
        getGameStateById(req.session.roomId).endGame();
        closeSocket();
        req.session.destroy();
        getGameStateById(req.session.roomId).setStatus("NOT_STARTED");
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

const getGameStateById = (roomId) => games.find(game => game.roomId === roomId).gameState;

module.exports = router;
