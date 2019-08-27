const { GameLogic } = require('../models/GameLogic');
const roomNames = require('../../roomnames');
const fs = require('fs');

/** @type {{ roomId: number, gameState: GameLogic }[]} */
let rooms = [];
let latestRoomId = 0;

exports.getAll = () => rooms;

exports.getById = roomId => rooms.find(room => room.roomId === roomId);

exports.isStarted = room => room.gameState.status !== 'NOT_STARTED';

exports.create = (numRounds, gameMode) => {
    return new Promise((resolve, reject) => {
        const roomId = latestRoomId;
        latestRoomId++;
        const dir = `./src/images/${gameMode === 'telltales' ? 'cards/' : 'uploads/'}`;
        fs.readdir(dir, (err, files) => {
            if (err) {
                reject(err);
            }
            if (files.length >= 50) {
                const gameState = new GameLogic(roomId, numRounds, files.length);
                rooms.push({ roomId, title: roomNames[Math.floor(Math.random() * 78)], gameState });         
                resolve(roomId);
            } else {
                reject({ message: "Not enough cards in the server. Upload more." });
            }
        });
    });
};

const deleteById = roomId => {
    rooms = rooms.filter(room => room.roomId !== roomId);
};
exports.deleteById = deleteById;

exports.addPlayer = (room, user) => {
    room.gameState.joinGame(user);
};

exports.removePlayer = (room, username) => {
    room.gameState.quitGame(username);
    const playersInRoom = room.gameState.getPlayers();    
    if (!playersInRoom.length || playersInRoom.every(player => !player.real)) deleteById(room.roomId);
};

exports.reset = () => {
    rooms.forEach(room => room.gameState.clearGameState());
    rooms = [];
    latestRoomId = 0;
};
