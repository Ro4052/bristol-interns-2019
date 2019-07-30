const express = require('express');
const router = express.Router();
const auth = require('./auth');
const { GameLogic, minPlayers } = require('../services/GameLogic');
const { createRoom, joinRoom, leaveRoom } = require('../services/socket');

/** @type {{ roomId: number, gameState: GameLogic }[]} */
let rooms = [];
let latestRoomId = 0;

/* Helper functions */

exports.resetRooms = () => {
    latestRoomId = 0;
    rooms = [];
}

const getGameStateById = roomId => {
    const game = rooms.find(game => game.roomId === roomId);
    if (game) return game.gameState;
}
exports.getGameStateById = getGameStateById;

const deleteRoom = roomId => rooms = rooms.filter(game => game.roomId !== roomId);
exports.deleteRoom = deleteRoom;

const setupRoom = creator => {
    const roomId = latestRoomId;
    latestRoomId++;
    const gameState = new GameLogic(roomId);
    rooms.push({ roomId, gameState });
    createRoom(roomId, minPlayers);
    addPlayerToRoom(creator, roomId);
    return roomId;
};

const removePlayerFromRoom = (username, roomId) => {
    if (roomId !== null) {
        const gameState = getGameStateById(roomId);
        if (gameState && gameState.getPlayers().length > 1) {
            gameState.quitGame(username);
            leaveRoom(username, roomId);
            if (!gameState.getPlayers().length) deleteRoom(roomId);
        } else {
            throw Error("You are the only player in your existing room");
        }    
    }
};

const addPlayerToRoom = (username, roomId) => {
    const gameState = getGameStateById(roomId);
    if (gameState) {
        joinRoom(username, roomId);
        gameState.joinGame(username);
    } else {
        throw Error("Room doesn't exist");
    }
}

/* Endpoints */

/* Create and join room */
router.post('/create', auth, (req, res) => {
    const { user, roomId } = req.session;
    try {
        removePlayerFromRoom(user, roomId);
        req.session.roomId = setupRoom(user);
        res.sendStatus(200);
    } catch (err) {
        console.log(err);
        res.status(400).json({ message: err.message });
    }
});

/* Join a room */
router.post('/join', auth, (req, res) => {
    const { user, roomId } = req.session;
    const newRoomId = req.body.roomId;
    console.log(newRoomId);
    try {
        removePlayerFromRoom(user, roomId);
        req.session.roomId = null;
        addPlayerToRoom(user, newRoomId);
        req.session.roomId = newRoomId;
        res.sendStatus(200);
    } catch (err) {
        console.log(err);
        res.status(400).json({ message: err.message })
    }
});

/* Leave a room */
router.post('/leave', auth, (req, res) => {
    const { user, roomId } = req.session;
    try {
        removePlayerFromRoom(user, roomId);
        req.session.roomId = null;
        res.sendStatus(200);
    } catch (err) {
        console.log(err);
        res.status(400).json({ message: err.message })
    }
});

exports.roomsRouter = router;
