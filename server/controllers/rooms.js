const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const socket = require('../services/socket');

/* Model */
const Room = require('../models/room');

/* Create and join room */
router.post('/create', auth, (req, res) => {
    const { user, roomId } = req.session;
    const { number } = req.body;
    try {
        const room = Room.getById(roomId);
        if (room) {
            if (room.gameState.players.length === 1) {
                throw Error("Cannot leave current room");
            } else {
                Room.removePlayer(room, user);
            }
        }
        const newRoomId = Room.create(number);
        const newRoom = Room.getById(newRoomId);
        Room.addPlayer(newRoom, user);
        socket.joinRoom(newRoomId, user);
        socket.emitRooms();
        req.session.roomId = newRoomId;

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
    try {
        const oldRoom = Room.getById(roomId);
        if (oldRoom) {
            Room.removePlayer(oldRoom, user);
        }
        req.session.roomId = null;
        const newRoom = Room.getById(newRoomId);
        if (newRoom) {
            Room.addPlayer(newRoom, user);
            socket.joinRoom(newRoomId, user);
            req.session.roomId = newRoomId;
        }
        socket.emitRooms();
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
        const room = Room.getById(roomId);
        if (room) {
            Room.removePlayer(room, user);
            socket.leaveRoom(user);
        }
        socket.emitRooms();
        req.session.roomId = null;
        res.sendStatus(200);
    } catch (err) {
        console.log(err);
        res.status(400).json({ message: err.message })
    }
});

module.exports = router;
