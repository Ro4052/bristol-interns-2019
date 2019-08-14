const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const socket = require('../services/socket');

/* Model */
const Room = require('../models/room');

/* Create and join room */
router.post('/create', auth, (req, res) => {
    const { user, roomId } = req.session;
    const { numRounds } = req.body;
    try {
        const room = Room.getById(roomId);
        if (room) {
            if (room.gameState.players.length === 1) {
                throw Error("Cannot leave current room");
            } else {
                Room.removePlayer(room, user.username);
            }
        }
        const newRoomId = Room.create(numRounds);
        const newRoom = Room.getById(newRoomId);
        Room.addPlayer(newRoom, user);
        socket.joinRoom(newRoomId, user.username);
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
        console.log(err);
        res.status(400).json({ message: err.message })
    }
});

/* Add an automated player to the room */
router.post('/addAutoPlayer', (req, res) => {
    try {
        const { roomId }= req.body;
        const x = Room.getById(roomId).gameState.getNumberofAutoPlayers();
        const user = { username: "Computer " + x, id: 0, real: false};
        const room = Room.getById(roomId);
        Room.addPlayer(room, user);
        socket.emitRooms();
        req.session.roomId = roomId;
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
            Room.removePlayer(room, user.username);
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
