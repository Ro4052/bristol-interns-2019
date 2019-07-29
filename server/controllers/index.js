const validWord = require('../services/validWord');
const router = require('express').Router();
const path = require('path');
const auth = require('../services/auth');
const { GameLogic, minPlayers } = require('../services/GameLogic');
const { disconnectSocket, closeSockets, createRoom, joinRoom, leaveRoom, setRoomStarted, closeRoom } = require('../services/socket');

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
            const gameState = getGameStateById(roomId);
            // Why do we need both of these?
            gameState.quitGame(user);
            gameState.removePlayer(user);
            if (gameState.getPlayers().length <= 0) games = games.filter(otherGame => otherGame !== gameState);
            leaveRoom(user, roomId);
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

/* Create a room (a single instance of a game) */
router.post('/api/room/create', auth, (req, res) => {
    const { user } = req.session;
    try {
        if (req.session.roomId !== null) {
            const oldRoomId = req.session.roomId;
            const game = getGameStateById(oldRoomId);
            game.quitGame(user);
            if (!game.getPlayers().length) games = games.filter(otherGame => otherGame !== game);
            leaveRoom(user, oldRoomId);
            req.session.roomId = null;
        }
        const newGameState = new GameLogic(latestRoomId);
        const newGameRoom = {roomId: latestRoomId, gameState: newGameState}
        createRoom(user, latestRoomId, minPlayers);
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
        if (req.session.roomId !== null) {
            const oldRoomId = req.session.roomId;
            const game = getGameStateById(oldRoomId);
            game.quitGame(user);
            if (!game.getPlayers().length) games = games.filter(otherGame => otherGame !== game);
            leaveRoom(user, oldRoomId);
            req.session.roomId = null;
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
        const game = getGameStateById(roomId);
        game.quitGame(user);
        if (game.getPlayers().length <= 0) games = games.filter(otherGame => otherGame !== game);
        leaveRoom(user, roomId);
        req.session.roomId = null;
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
        const gameState = getGameStateById(req.session.roomId);
        gameState.endGame();
        games = games.filter(otherGame => otherGame !== gameState);
        closeRoom(req.session.roomId);
        res.sendStatus(200);
    } catch (err) {
        res.status(400).json({message: err.message});
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
});

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
            closeSockets();
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
