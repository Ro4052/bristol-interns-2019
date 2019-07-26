const validWord = require('../services/validWord');
const router = require('express').Router();
const path = require('path');
const auth = require('../services/auth');
const GameLogic = require('../services/GameLogic');
const { closeSocket, createRoom, joinRoom, leaveRoom, getRooms, setRoomStarted, closeRoom } = require('../services/socket');

let currentUsers = [];
let latestRoomId = 0;
/** @type {{ roomId: number, gameState: GameLogic }[]} */
let games = [];

const getGameStateById = roomId => games.find(game => game.roomId === roomId).gameState;

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
        const user = { username };
        try {
            currentUsers.push(user);
            res.status(200).json({rooms: getRooms()});
        } catch (err) {
            res.status(400).json({ message: err.message });
        };
    }
});

/* Log out the user */
router.get('/auth/logout', auth, (req, res) => {
    try { /* Game has finished, or has not been started yet */
        getGameStateById(req.session.roomId).quitGame(req.session.user);
        currentUsers = currentUsers.filter((otherUser) => otherUser.username !== req.session.user);
        getGameStateById(req.session.roomId).removePlayer(req.session.user);
        req.session.destroy();
        closeSocket();
        res.sendStatus(200);
    } catch (err) { /* Game has started, method not allowed */
        res.status(400).json({message: err.message});
    }    
});

/* Create a room (a single instance of a game) */
router.post('/api/room/create', auth, (req, res) => {
    const { user } = req.session;
    try {
        if (req.session.roomId !== undefined) {
            const oldRoomId = req.session.roomId;
            let game = getGameStateById(oldRoomId);
            game.quitGame(user);
            if (!game.getPlayers().length) games = games.filter(otherGame => otherGame !== game);
            leaveRoom(user, oldRoomId);
            req.session.roomId = undefined;
        }
        let newGameState = new GameLogic(latestRoomId);
        let newGameRoom = {roomId: latestRoomId, gameState: newGameState}
        createRoom(user, latestRoomId, newGameState.getMinPlayers());
        games.push(newGameRoom);
        newGameState.joinGame(user);
        req.session.roomId = latestRoomId;    
        res.sendStatus(200);
        latestRoomId++;
    } catch (err) {
        console.log(err);
        res.status(400).json({message: err.message});
    }
});

/* Join a room */
router.post('/api/room/join', auth, (req, res) => {
    const { user } = req.session;
    const { roomId } = req.body;
    try {
        if (req.session.roomId !== undefined) {
            const oldRoomId = req.session.roomId;
            let game = getGameStateById(oldRoomId);
            game.quitGame(user);
            if (!game.getPlayers().length) games = games.filter(otherGame => otherGame !== game);
            leaveRoom(user, oldRoomId);
            req.session.roomId = undefined;
        }
        joinRoom(user, roomId);
        getGameStateById(roomId).joinGame(user);
        req.session.roomId = roomId; 
        res.sendStatus(200);
    } catch (err) {
        console.log(err);
        res.status(400).json({message: err.message})
    }
});

/* Leave a room */
router.post('/api/room/leave', auth, (req, res) => {
    const { user } = req.session;
    const { roomId } = req.body;
    try {
        let game = getGameStateById(roomId);
        game.quitGame(user);
        if (game.getPlayers().length <= 0) games = games.filter(otherGame => otherGame !== game);
        leaveRoom(user, roomId);
        req.session.roomId = undefined;
        res.sendStatus(200);
    } catch (err) {
        console.log(err);
        res.status(400).json({message: err.message})
    }
});

/* Get the players list of cards */
router.get('/api/cards', auth, (req, res) => {
    const gameState = getGameStateById(req.session.roomId);
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
        getGameStateById(roomId).startGame();
        setRoomStarted(roomId);
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
        closeRoom(req.session.roomId);
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
            console.log(err);
            res.status(400).json({ message: err.message});
        }
    } else { /* Current player attempts to vote for their card */
        res.status(400).json({ message: "You cannot vote for a card when it is your turn."});
    }
});

/* Check if in dev mode, and enable end game request */
if (process.env.NODE_ENV === 'testing') {
    router.post('/api/reset-server', (req, res) => {
        try {
            games.forEach(game => game.gameState.clearGameState());
            currentUsers = [];
            latestRoomId = 0;
            games = [];
            res.sendStatus(200);
        } catch (err) {
            console.log(err);
            res.status(400).json({ message: err.message});
        } finally {
            closeSocket();
            req.session.destroy();
        }
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
