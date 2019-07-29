const express = require('express');
const router = express.Router();
const auth = require('./auth');
const { GameLogic, minPlayers } = require('../services/GameLogic');
const { createRoom, joinRoom, leaveRoom } = require('../services/socket');

let latestRoomId = 0;

/** @type {{ roomId: number, gameState: GameLogic }[]} */
let rooms = [];

const getGameStateById = roomId => {
    const game = rooms.find(game => game.roomId === roomId);
    if (game) return game.gameState;
}
exports.getGameStateById = getGameStateById;

const removeGameById = roomId => rooms = rooms.filter(game => game.roomId !== roomId);
exports.removeGameById = removeGameById;

const clearAllGameStates = () => {
    rooms.forEach(game => game.gameState.clearGameState());
}
exports.clearAllGameStates = clearAllGameStates;

const resetGames = () => {
    latestRoomId = 0;
    rooms = [];
}
exports.resetGames = resetGames;

const setupRoom = user => {
    const newGameState = new GameLogic(latestRoomId);
    const newGameRoom = {roomId: latestRoomId, gameState: newGameState}
    createRoom(user, latestRoomId, minPlayers);
    rooms.push(newGameRoom);
    newGameState.joinGame(user);
};

/* Create a room (a single instance of a game) */
router.post('/create', auth, (req, res) => {
    const { user, roomId } = req.session;
    try {
        if (roomId !== null) {
            const game = getGameStateById(roomId);
            if (game) {
                if (game.getPlayers().length > 1) {
                    game.quitGame(user);
                    leaveRoom(user, roomId);
                    req.session.roomId = null;
                    setupRoom(user);
                    req.session.roomId = latestRoomId;    
                    latestRoomId++;
                }
            } else {
                setupRoom(user);
                req.session.roomId = latestRoomId;    
                latestRoomId++;
            }
        } else {
            setupRoom(user);
            req.session.roomId = latestRoomId;    
            latestRoomId++;
        }
        res.sendStatus(200);
    } catch (err) {
        console.log(err);
        res.status(400).json({message: err.message});
    }
});

/* Join a room */
router.post('/join', auth, (req, res) => {
    const { user } = req.session;
    const { roomId } = req.body;
    try {
        const oldRoomId = req.session.roomId
        if (oldRoomId !== null) {
            const game = getGameStateById(oldRoomId);
            if (game) {
                game.quitGame(user);
                if (!game.getPlayers().length) rooms = rooms.filter(otherGame => otherGame !== game);
                leaveRoom(user, oldRoomId);
            }
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
router.post('/leave', auth, (req, res) => {
    const { user } = req.session;
    const { roomId } = req.body;
    try {
        const game = getGameStateById(roomId);
        game.quitGame(user);
        if (game.getPlayers().length <= 0) rooms = rooms.filter(otherGame => otherGame !== game);
        leaveRoom(user, roomId);
        req.session.roomId = null;
        res.sendStatus(200);
    } catch (err) {
        console.log(err);
        res.status(400).json({message: err.message})
    }
});

exports.roomsRouter = router;
