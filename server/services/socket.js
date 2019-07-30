const socketio = require('socket.io');
const sharedsession = require("express-socket.io-session");

let io;
let sockets = [];

/** @type {{ roomId: number, started: boolean, players: {{ username: string }[]}, minPlayers: number }[]} */
let rooms = [];

// Emit the newly created room
const emitRooms = () => sockets.forEach(socket => socket.emit("rooms", rooms));

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

// Disconnect a single socket
exports.disconnectSocket = username => {
    const socket = sockets.find(socket => socket.handshake.session.user === username);
    if (socket) socket.disconnect();
};

// Close all the sockets and reset the rooms
exports.closeSockets = () => {
    rooms = [];
    sockets.forEach(socket => socket.disconnect());
    sockets = [];
    emitRooms();
};

// Create a room
exports.createRoom = (roomId, minPlayers) => {
    if (rooms.length < 10) {
        rooms.push({ roomId, started: false, players: [], minPlayers });
        emitRooms();
    } else {
        throw new Error("No more than 10 rooms can exist at the same time");
    }
};

// Join an existing room
exports.joinRoom = (username, roomId) => {
    const room = rooms.find(room => room.roomId === roomId);
    if (!room.players.some(player => player.username === username)) {
        const socket = sockets.find(socket => socket.handshake.session.user === username);
        socket.handshake.session.roomId = roomId;
        room.players.push({ username });
        emitRooms();
    } else {
        throw new Error("You cannot join the room again.");
    }
};

// Leave a room
exports.leaveRoom = (username, roomId) => {
    const room = rooms.find((room) => room.roomId === roomId);
    const socket = sockets.find(socket => socket.handshake.session.user === username);
    socket.handshake.session.roomId = null;
    room.players = room.players.filter(player => player.username !== username );
    if (room.players.length <= 0) rooms = rooms.filter(otherRoom => otherRoom !== room);
    emitRooms();
};

// Close a room
exports.closeRoom = (roomId) => {
    sockets.forEach(socket => socket.handshake.session.roomId === roomId && (socket.handshake.session.roomId = undefined));
    rooms = rooms.filter(room => room.roomId !== roomId);
    this.emitRooms();
};

// Set that the room has started
exports.setRoomStarted = roomId => {
    const room = rooms.find(room => room.roomId === roomId);
    if (room) room.started = true;
    emitRooms();
}

// Emit all the players
const emitPlayers = (roomId, players) => sockets.forEach(socket => socket.handshake.session.roomId === roomId && socket.emit("players", { players }));
exports.emitPlayers = emitPlayers;

// Let the players know about the next round
exports.emitNewRound = (roomId, status, roundNum, currentPlayer) => sockets.forEach(socket => socket.handshake.session.roomId === roomId && socket.emit("new round", { status, roundNum, currentPlayer}));

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
exports.emitEndGame = (roomId) => sockets.forEach(socket => socket.handshake.session.roomId === roomId && socket.emit("end"));

// Ask the current player for a word and a card
exports.promptCurrentPlayer = (roomId, currentPlayer) => {
    const current = sockets.find(socket => (socket.handshake.session.user === currentPlayer.username && socket.handshake.session.roomId === roomId));
    if (current) current.emit("play word and card");
};

// Prompt the players to pick a card
exports.promptOtherPlayers = (roomId, currentPlayer, timeoutDuration) => sockets.forEach(socket => socket.handshake.session.user !== currentPlayer.username && socket.handshake.session.roomId === roomId && socket.emit("play card", timeoutDuration/1000));

// Ask the other players to vote on the cards
exports.promptPlayersVote = (roomId, currentPlayer, timeoutDuration) => sockets.forEach(socket => socket.handshake.session.user !== currentPlayer.username && socket.handshake.session.roomId === roomId && socket.emit("vote", timeoutDuration/1000));
