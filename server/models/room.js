const { GameLogic } = require('../models/GameLogic');
const { statusTypes } = require('./statusTypes');
const socket = require('../services/socket');
const roomNames = require('../../roomnames');

/** @type {{ roomId: number, gameState: GameLogic }[]} */
let rooms = [];
let latestRoomId = 0;

const db = (process.env.NODE_ENV === 'testing') ? require('../queries/testdb') : require('../queries/db');

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

exports.create = (numRounds, gameMode) => {
    return new Promise((resolve, reject) => {
        const roomId = latestRoomId;
        latestRoomId++;
        if (gameMode === 'custom') {
            db.getAllCards()
            .then(cards => {                         
                if (cards.length >= 50) {
                    const gameState = new GameLogic(update(roomId), roomId, numRounds, gameMode, cards.length);
                    rooms.push({ roomId, title: roomNames[Math.floor(Math.random() * roomNames.length)], gameState });         
                    resolve(roomId);
                } else {
                    reject({
                        code: 400,
                        message: `Not enough cards in the server (currently ${cards.length}). Upload more.`
                    });
                }
            })
            .catch(err => {
                reject({
                    code: err.code,
                    message: err.message
                });
            });
        } else {
            const cardsLength = 247;
            const gameState = new GameLogic(update(roomId), roomId, numRounds, gameMode, cardsLength);
            rooms.push({ roomId, title: roomNames[Math.floor(Math.random() * roomNames.length)], gameState });         
            resolve(roomId);
        }
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
