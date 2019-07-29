const express = require('express');
const router = express.Router();
const auth = require('./auth');
const { GameLogic, minPlayers } = require('../services/GameLogic');
const { createRoom, joinRoom, leaveRoom } = require('../services/socket');

/** @type {{ roomId: number, gameState: GameLogic }[]} */
let rooms = [];
let latestRoomId = 0;

/* Helper functions */

const resetRooms = () => {
    latestRoomId = 0;
    rooms = [];
}
exports.resetRooms = resetRooms;

const getGameStateById = roomId => {
    const game = rooms.find(game => game.roomId === roomId);
    if (game) return game.gameState;
}
exports.getGameStateById = getGameStateById;

const deleteRoomById = roomId => rooms = rooms.filter(game => game.roomId !== roomId);
exports.deleteRoomById = deleteRoomById;

const setupRoom = creator => {
    // Get the next roomId
    const roomId = latestRoomId;
    latestRoomId++;
    // Create a gameState and room
    const gameState = new GameLogic(roomId);
    rooms.push({ roomId, gameState });
    // Create a socket room
    createRoom(creator, roomId, minPlayers);
    // Add the creator to the room
    gameState.joinGame(creator);
    // Return the new roomId
    return roomId;
};

/* Endpoints */

/* Create and join room */
router.post('/create', auth, (req, res) => {
    const { user, roomId } = req.session;
    try {
        if (roomId !== null) {
            const game = getGameStateById(roomId);
            if (game) {
                if (game.getPlayers().length > 1) {
                    game.quitGame(user);
                    leaveRoom(user, roomId);
                    req.session.roomId = setupRoom(user);
                }
            } else req.session.roomId = setupRoom(user);
        } else req.session.roomId = setupRoom(user);
        res.sendStatus(200);
    } catch (err) {
        console.log(err);
        res.status(400).json({message: err.message});
    }
});

/* Join a room */
router.post('/join', auth, (req, res) => {
    const { user, roomId } = req.session;
    const { newRoomId } = req.body;
    try {
        if (roomId !== null) {
            const game = getGameStateById(roomId);
            if (game) {
                game.quitGame(user);
                if (!game.getPlayers().length) rooms = rooms.filter(otherGame => otherGame !== game);
                leaveRoom(user, roomId);
            }
            req.session.roomId = null;
        }
        joinRoom(user, newRoomId);
        getGameStateById(newRoomId).joinGame(user);
        req.session.roomId = newRoomId; 
        res.sendStatus(200);
    } catch (err) {
        console.log(err);
        res.status(400).json({message: err.message})
    }
});

/* Leave a room */
router.post('/leave', auth, (req, res) => {
    const { user, roomId } = req.session;
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
