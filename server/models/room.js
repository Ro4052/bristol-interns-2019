const { GameLogic } = require('../models/GameLogic');

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
    rooms.push({ roomId, gameState });
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
    if (!room.gameState.getPlayers().length) deleteById(room.roomId);
};

exports.reset = () => {
    rooms.forEach(room => room.gameState.clearGameState());
    rooms = [];
    latestRoomId = 0;
};
