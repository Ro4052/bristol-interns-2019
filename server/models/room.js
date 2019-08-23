const { GameLogic } = require('../models/GameLogic');
const roomNames = require('../../roomnames');

/** @type {{ roomId: number, gameState: GameLogic }[]} */
let rooms = [];
let latestRoomId = 0;

exports.getAll = () => rooms;

exports.getById = roomId => rooms.find(room => room.roomId === roomId);

exports.isStarted = room => room.gameState.status !== 'NOT_STARTED';

exports.create = numRounds => {
    const roomId = latestRoomId;
    latestRoomId++;
    const gameState = new GameLogic(roomId, numRounds);
    rooms.push({ roomId, title: roomNames[Math.floor(Math.random() * 78)], gameState });
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
