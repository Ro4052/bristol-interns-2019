const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const socket = require('../services/socket');

/* Model */
const Room = require('../models/room');

/* Create and join room */
router.post('/create', auth, (req, res) => {
    const { user, roomId } = req.session;
    const { numRounds, gameMode } = req.body;
    try {
        const room = Room.getById(roomId);
        if (room) {
            if (room.gameState.getPlayers().length === 1) {
                throw Error("You're already in a room!");
            } else {
                Room.removePlayer(room, user.username);
            }
        }
        Room.create(numRounds, gameMode)
        .then(newRoomId => {
            const newRoom = Room.getById(newRoomId);
            Room.addPlayer(newRoom, user);
            socket.joinRoom(newRoomId, user.username);
            socket.emitRooms();
            req.session.roomId = newRoomId;                    
            res.sendStatus(200);
        })
        .catch(err => {            
            console.error(err);
            res.status(400).json({ message: err.message });
        });
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: err.message });
    }
});

/* Join a room */
router.post('/join', auth, (req, res) => {
    const { user, roomId } = req.session;
    const newRoomId = req.body.roomId;
    try {
        const oldRoom = Room.getById(roomId);
        if (oldRoom) {
            Room.removePlayer(oldRoom, user.username);
        }
        req.session.roomId = null;
        const newRoom = Room.getById(newRoomId);
        if (newRoom) {
            Room.addPlayer(newRoom, user);
            socket.joinRoom(newRoomId, user.username);
            req.session.roomId = newRoomId;
        }
        socket.emitRooms();
        res.sendStatus(200);
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: err.message })
    }
});

/* Add an automated player to the room */
router.post('/addAIPlayer', (req, res) => {
    try {
        const { roomId } = req.body;
        const nextAutoId = Room.getById(roomId).gameState.state.nextAutoId;
        const user = { username: `CPU ${nextAutoId}`, id: 0, real: false};
        const room = Room.getById(roomId);
        Room.addPlayer(room, user);
        socket.emitRooms();
        req.session.roomId = roomId;
        res.sendStatus(200);
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: err.message });
    }
});

/* Removes an automated player from the room */
router.post('/removeAIPlayer', (req, res) => {
    try {
        const { roomId, username } = req.body;
        const room = Room.getById(roomId);
        Room.removePlayer(room, username);
        socket.emitRooms();
        res.sendStatus(200);
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: err.message })
    }
});

/* Leave a room */
router.post('/leave', auth, (req, res) => {
    const { user, roomId } = req.session;
    try {
        const room = Room.getById(roomId);
        if (room) {
            Room.removePlayer(room, user.username);
            socket.leaveRoom(user.username);
        }
        socket.emitRooms();
        req.session.roomId = null;
        res.sendStatus(200);
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: err.message })
    }
});

module.exports = router;
