const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { GameLogic, minPlayers } = require('../services/GameLogic');
const { createRoom, joinRoom, leaveRoom } = require('../services/socket');

let latestRoomId = 0;
let games = [];

const getGameStateById = roomId => games.find(game => game.roomId === roomId).gameState;
exports.getGameStateById = getGameStateById;

const setupRoom = user => {
    const newGameState = new GameLogic(latestRoomId);
    const newGameRoom = {roomId: latestRoomId, gameState: newGameState}
    createRoom(user, latestRoomId, minPlayers);
    games.push(newGameRoom);
    newGameState.joinGame(user);
};

/* Create a room (a single instance of a game) */
router.post('/api/room/create', auth, (req, res) => {
    const { user } = req.session;
    try {
        if (req.session.roomId !== null) {
            const oldRoomId = req.session.roomId;
            const game = getGameStateById(oldRoomId);
            if (game.getPlayers().length !== 1) {
                game.quitGame(user);
                if (!game.getPlayers().length) games = games.filter(otherGame => otherGame !== game);
                leaveRoom(user, oldRoomId);
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
        res.sendStatus(200);
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

exports.router = router;
