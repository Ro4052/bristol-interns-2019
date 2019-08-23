const { GameLogic } = require('../models/GameLogic');
const { statusTypes } = require('./statusTypes');
const dogBreeds = require('dog-breeds');
const socket = require('../services/socket');

/** @type {{ roomId: number, gameState: GameLogic }[]} */
let rooms = [];
let latestRoomId = 0;

let db;

if (process.env.NODE_ENV === 'testing') {
    db = require('../queries/testdb');
} else {
    db = require('../queries/db');
}

exports.getAll = () => rooms;

exports.getById = roomId => rooms.find(room => room.roomId === roomId);

exports.isStarted = room => room.gameState.isStarted();

const update = roomId => state => {
    const { status } = state;
    const room = this.getById(roomId);
    if (room) {
        const { gameState } = room;
        if (status === statusTypes.GAME_OVER) {
            gameState.getPlayers().forEach(player => {
                db.updateScore(player.id, player.score)
                .catch(err => console.error(err));
            });
            socket.emitEndGame(roomId);
            socket.closeRoom(roomId);
            this.deleteById(roomId);
        }
    }
}

exports.create = numRounds => {
    const roomId = latestRoomId;
    latestRoomId++;
    const gameState = new GameLogic(update(roomId), roomId, numRounds);
    rooms.push({ roomId, title: dogBreeds.random().name, gameState });
    return roomId;
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
