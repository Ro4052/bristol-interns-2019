const socketio = require('socket.io');
const sharedsession = require("express-socket.io-session");
const { statusTypes } = require('../models/statusTypes');
const { minPlayers } = require('../models/GameLogic');
const Room = require("../models/room");

let io;
let sockets = [];

// Setup the socket for connections
exports.setupSocket = (server, session) => {
    io = socketio(server);
    io.use(sharedsession(session));
    io.on('connection', socket => {
        if (socket.handshake.session.user) {
            sockets = sockets.filter(otherSocket => otherSocket.handshake.session.user !== socket.handshake.session.user);
            sockets.push(socket);
            emitRooms();
        } else {
            socket.disconnect();
        }
        socket.on('disconnect', disconnected => {
            sockets = sockets.filter(socket => socket !== disconnected);
        });
    });
}

// Create a room
exports.createRoom = (username, roomId, minPlayers) => {
    if (!rooms.some((room) => room.creator === username) && rooms.length < 10) {
        rooms.push({ roomId, started: false, creator: { username }, players: [{ username }], minPlayers });
        const socket = sockets.find(socket => socket.handshake.session.user === username);
        socket.handshake.session.roomId = roomId;
        this.emitRooms();
    } else {
        throw new Error("You cannot create two rooms or no more than 10 rooms can exist at the same time");
    }
};

// Set number of rounds
exports.roundCount = (roomId, word) => sockets.forEach(socket => socket.handshake.session.roomId === roomId && socket.emit("round count", word));

// Join an existing room
exports.joinRoom = (username, roomId) => {
    const room = rooms.find((room) => room.roomId === roomId);
    if (!room.players.some(player => player.username === username)) {
        const socket = sockets.find(socket => socket.handshake.session.user === username);
        socket.handshake.session.roomId = roomId;
        room.players.push({ username });
        this.emitRooms();
    } else {
        throw new Error("You cannot join the room again.");
    }
};
// Emit the rooms
const emitRooms = () => {
    const rooms = Room.getAll().map(room => ({
        roomId: room.roomId,
        started: room.gameState.status !== statusTypes.NOT_STARTED,
        players: room.gameState.players,
        minPlayers
    }));
    sockets.forEach(socket => socket.emit("rooms", rooms));
}
exports.emitRooms = emitRooms;

// Disconnect a single socket
exports.disconnectSocket = username => {
    const socket = sockets.find(socket => socket.handshake.session.user === username);
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
    const socket = sockets.find(socket => socket.handshake.session.user === username);
    if (socket) socket.handshake.session.roomId = roomId;
}

// Leave the room that you are in
exports.leaveRoom = username => {
    const socket = sockets.find(socket => socket.handshake.session.user === username);
    if (socket) socket.handshake.session.roomId = null;
}

// Close a room
exports.closeRoom = roomId => {
    sockets.forEach(socket => socket.handshake.session.roomId === roomId && (socket.handshake.session.roomId = undefined));
    emitRooms();
};


// Emit all the players
exports.emitPlayers = (roomId, players) => sockets.forEach(socket => socket.handshake.session.roomId === roomId && socket.emit("players", { players }));

// Let the players know about the next round
exports.emitNewRound = (roomId, status, roundNum, currentPlayer) => sockets.forEach(socket => socket.handshake.session.roomId === roomId && socket.emit("new round", { status, roundNum, currentPlayer }));

// Emit the new status of the game
exports.emitStatus = (roomId, status) => sockets.forEach(socket => socket.handshake.session.roomId === roomId && socket.emit("status", { status }));

// Emit start of the game
exports.emitStartGame = roomId => sockets.forEach(socket => socket.handshake.session.roomId === roomId && socket.emit("start"));

// Tell all the players what word was played
exports.emitWord = (roomId, word) => sockets.forEach(socket => socket.handshake.session.roomId === roomId && socket.emit("played word", word));

exports.emitPlayedCard = (username, card) => {
    const socket = sockets.find(socket => socket.handshake.session.user === username);
    if (socket) socket.emit("played card", card);
};

// When everyone has played their cards, send them all to the players
exports.emitPlayedCards = (roomId, cards) => sockets.forEach(socket => socket.handshake.session.roomId === roomId && socket.emit("played cards", cards));

// When everyone has played their cards, send them all to the players
exports.emitAllVotes = (roomId, votes) => sockets.forEach(socket => socket.handshake.session.roomId === roomId && socket.emit("all votes", votes));

// When game is over, emit the winner to everyone
exports.emitWinner = (roomId, player) => sockets.forEach(socket => socket.handshake.session.roomId === roomId && socket.emit("winner", player));

// When game is over, tell the users
exports.emitEndGame = roomId => sockets.forEach(socket => socket.handshake.session.roomId === roomId && socket.emit("end"));

// Ask the current player for a word and a card
exports.promptCurrentPlayer = (roomId, currentPlayer, timeoutDuration) => {
    const current = sockets.find(socket => (socket.handshake.session.user === currentPlayer.username && socket.handshake.session.roomId === roomId));
    if (current) current.emit("play word and card", timeoutDuration/1000);
};

// Prompt the players to pick a card
exports.promptOtherPlayers = (roomId, currentPlayer, timeoutDuration) => sockets.forEach(socket => socket.handshake.session.user !== currentPlayer.username && socket.handshake.session.roomId === roomId && socket.emit("play card", timeoutDuration/1000));

// Ask the other players to vote on the cards
exports.promptPlayersVote = (roomId, currentPlayer, timeoutDuration) => sockets.forEach(socket => socket.handshake.session.user !== currentPlayer.username && socket.handshake.session.roomId === roomId && socket.emit("vote", timeoutDuration/1000));
