const socketio = require('socket.io');
const sharedsession = require("express-socket.io-session");
const { minPlayers, maxPlayers } = require('../models/GameLogic');
const Room = require("../models/room");

let io;
let sockets = [];

// Setup the socket for connections
exports.setupSocket = (server, session) => {
    io = socketio(server);
    io.use(sharedsession(session));
    io.on('connection', socket => {
        const { user, roomId } = socket.handshake.session;
        if (user) {
            if (roomId !== null) {
                try {
                    const gameState = Room.getById(roomId).gameState.getState(user.username);
                    socket.emit('game state', gameState);
                } catch (err) {
                    console.log(err);
                }
            }
            sockets = sockets.filter(otherSocket => otherSocket.handshake.session.user.username !== user.username);
            sockets.push(socket);
            emitRooms();
            socket.on('send message', message => {
                emitMessage(socket, message);
            });
        } else {
            socket.disconnect();
        }
        socket.on('disconnect', disconnected => {
            sockets = sockets.filter(socket => socket !== disconnected);
        });
    });
}

// Emit message in the lobby or in a specific room
const emitMessage = (socket, message) => {
    const senderRoomId = socket.handshake.session.roomId;
    const senderUsername = socket.handshake.session.user.username;
    const senderRoom = Room.getAll().find(room => room.roomId === senderRoomId);
    const senderRoomStarted = senderRoom && Room.isStarted(senderRoom);
    if (senderRoomStarted) {
        sockets.forEach(socket => socket.handshake.session.roomId === senderRoomId && socket.emit("message sent", { senderUsername, message }));
    } else {
        sockets.forEach(socket => {
            const socketRoomId = socket.handshake.session.roomId;
            const socketRoom = Room.getAll().find(room => room.roomId === socketRoomId);
            const socketRoomStarted = socketRoom && Room.isStarted(socketRoom);
            return !socketRoomStarted && socket.emit("message sent", { senderUsername, message })
        });
    }
};

// Emit the rooms
const emitRooms = () => {
    const rooms = Room.getAll().map(room => ({
        roomId: room.roomId,
        title: room.title,
        started: room.gameState.isStarted(),
        players: room.gameState.getPlayers(),
        minPlayers,
        maxPlayers
    }));
    sockets.forEach(socket => socket.emit("rooms", rooms));
}
exports.emitRooms = emitRooms;

// Disconnect a single socket
exports.disconnectSocket = username => {
    const socket = sockets.find(socket => socket.handshake.session.user.username === username);
    if (socket) socket.disconnect();
};

// Close all the sockets and reset the rooms
exports.disconnectAllSockets = () => {
    sockets.forEach(socket => socket.disconnect());
    sockets = [];
    emitRooms();
};

// Join an existing room
exports.joinRoom = (roomId, username) => {
    const socket = sockets.find(socket => socket.handshake.session.user.username === username);
    if (socket) socket.handshake.session.roomId = roomId;
}

// Leave the room that you are in
exports.leaveRoom = username => {
    const socket = sockets.find(socket => socket.handshake.session.user.username === username);
    if (socket) socket.handshake.session.roomId = null;
}

// Close a room
exports.closeRoom = roomId => {
    sockets.forEach(socket => socket.handshake.session.roomId === roomId && (socket.handshake.session.roomId = undefined));
    emitRooms();
};

// Emit all the players
exports.emitPlayers = (roomId, players) => sockets.forEach(socket => socket.handshake.session.roomId === roomId && socket.emit("players", { players }));

// Let the players know about the next round and prompt the current player
exports.emitNewRound = (roomId, status, roundNum, rounds, currentPlayer, timeoutDuration) => sockets.forEach(socket => {
    if (socket.handshake.session.roomId === roomId) {
        socket.emit("new round", { status, roundNum, rounds, currentPlayer });
        socket.emit("play word and card", { playWordAndCard: socket.handshake.session.user.username === currentPlayer.username, timeoutDuration: timeoutDuration/1000 });
    }
});

// Emit the new status of the game
exports.emitStatus = (roomId, status) => sockets.forEach(socket => socket.handshake.session.roomId === roomId && socket.emit("status", { status }));

// Emit start of the game
exports.emitStartGame = roomId => sockets.forEach(socket => socket.handshake.session.roomId === roomId && socket.emit("start"));

// Tell all the players what word was played
exports.emitWord = (roomId, word) => sockets.forEach(socket => socket.handshake.session.roomId === roomId && socket.emit("played word", word));

exports.emitPlayedCard = (username, card) => {
    const socket = sockets.find(socket => socket.handshake.session.user.username === username);
    if (socket) socket.emit("played card", card);
};

// When everyone has played their cards, send them all to the players
exports.emitPlayedCards = (roomId, cards) => sockets.forEach(socket => socket.handshake.session.roomId === roomId && socket.emit("played cards", cards));

// When game is over, emit the winners to everyone
exports.emitWinners = (roomId, winners) => sockets.forEach(socket => socket.handshake.session.roomId === roomId && socket.emit("winners", winners));

// When game is over, tell the users
exports.emitEndGame = roomId => sockets.forEach(socket => socket.handshake.session.roomId === roomId && socket.emit("end"));

// Prompt the players to pick a card
exports.promptOtherPlayers = (roomId, currentPlayer, timeoutDuration) => sockets.forEach(socket => socket.handshake.session.roomId === roomId && socket.emit("play card", { playCard: socket.handshake.session.user.username !== currentPlayer.username, timeoutDuration: timeoutDuration/1000 }));

// Ask the other players to vote on the cards
exports.promptPlayersVote = (roomId, currentPlayer, timeoutDuration) => sockets.forEach(socket => socket.handshake.session.roomId === roomId && socket.emit("vote", { voteCard: socket.handshake.session.user.username !== currentPlayer.username, timeoutDuration: timeoutDuration/1000 }));
