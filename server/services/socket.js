const socketio = require('socket.io');
const sharedsession = require("express-socket.io-session");

let io;
let sockets = [];

/** @type {{ roomId: number, started: boolean, creator: { username: string }, players: {{ username: string }[]}, minPlayers: number }[]} */
let rooms = [];

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
        socket.join(`room-${roomId}`);
        socket.handshake.session.roomId = roomId;
        this.emitRooms();
    } else {
        throw new Error("You cannot create two rooms or no more than 10 rooms can exist at the same time");
    }
};

// Join an existing room
exports.joinRoom = (username, roomId) => {
    const room = rooms.find((room) => room.roomId === roomId);
    if (!room.players.some(player => player.username === username)) {
        const socket = sockets.find(socket => socket.handshake.session.user === username);
        socket.join(`room-${roomId}`);
        socket.handshake.session.roomId = roomId;
        room.players.push({ username });
        this.emitRooms();
    } else {
        throw new Error("You cannot join the room again.");
    }
};

// Leave a room
exports.leaveRoom = (username, roomId) => {
    const room = rooms.find((room) => room.roomId === roomId);
    const socket = sockets.find(socket => socket.handshake.session.user === username);
    socket.leave(`room-${roomId}`);
    socket.handshake.session.roomId = undefined;
    room.players = room.players.filter(player => player.username !== username );
    if (room.players.length <= 0) rooms = rooms.filter(otherRoom => otherRoom !== room);
    this.emitRooms();
};

// Set that the room has started
exports.setRoomStarted = (roomId) => {
    const room = rooms.find(room => room.roomId === roomId);
    if (room) room.started = true;
    this.emitRooms();
}

// Close all the sockets
exports.closeSockets = () => {
    rooms = [];
    this.emitRooms();
    sockets.forEach(socket => socket.disconnect());
    sockets = [];
};

// Disconnect
exports.disconnectSocket = username => {
    const socket = sockets.find(socket => socket.handshake.session.user === username);
    if (socket) socket.disconnect();
}

// Check if it's the sender's turn
exports.isCurrentPlayerSocket = (socket, state) => state.currentPlayer && socket.handshake.session.user === state.currentPlayer.username;

// Emit all the players
const emitPlayers = (roomId, players) => io.to(`room-${roomId}`).emit("players", { players });
exports.emitPlayers = emitPlayers;

// Let the players know about the next round
exports.emitNewRound = (roomId, status, roundNum, currentPlayer) => sockets.forEach(socket => socket.handshake.session.roomId === roomId && socket.emit("new round", { status, roundNum, currentPlayer}));

// Get the current list of rooms
exports.getRooms = () => rooms;

// Emit the newly created room
const emitRooms = () => sockets.forEach(socket => socket.emit("rooms", rooms));
exports.emitRooms = emitRooms;

// Emit the new status of the game
exports.emitStatus = (roomId, status) => io.to(`room-${roomId}`).emit("status", { status });

// Emit start of the game
exports.emitStartGame = (roomId) => io.to(`room-${roomId}`).emit("start");

// Tell all the players what word was played
exports.emitWord = (roomId, word) => io.to(`room-${roomId}`).emit("played word", word);

exports.emitPlayedCard = (username, card) => {
    const socket = sockets.find(socket => socket.handshake.session.user === username);
    if (socket) socket.emit("played card", card);
};

// When everyone has played their cards, send them all to the players
exports.emitPlayedCards = (roomId, cards) => io.to(`room-${roomId}`).emit("played cards", cards);

// When everyone has played their cards, send them all to the players
exports.emitAllVotes = (roomId, votes) => io.to(`room-${roomId}`).emit("all votes", votes);

// When game is over, emit the winner to everyone
exports.emitWinner = (roomId, player) => io.to(`room-${roomId}`).emit("winner", player);

//When game is over, emit the drawers to everyone
exports.emitDrawers = (roomId, players) => io.to(`room-${roomId}`).emit("drawers", players);

// When game is over, tell the users
exports.emitEndGame = (roomId) => io.to(`room-${roomId}`).emit("end");

// Close the room when the game has ended
exports.closeRoom = (roomId) => {
    sockets.forEach(socket => socket.handshake.session.roomId === roomId && socket.leave(`room-${roomId}`));
    rooms = rooms.filter(room => room.roomId !== roomId);
    this.emitRooms();
};

// Ask the current player for a word and a card
const promptCurrentPlayer = (roomId, currentPlayer) => {
    const current = sockets.find(socket => (socket.handshake.session.user === currentPlayer.username && socket.handshake.session.roomId === roomId));
    if (current) current.emit("play word and card");
};
exports.promptCurrentPlayer = promptCurrentPlayer;

const promptOtherPlayers = (roomId, currentPlayer, timeoutDuration) => sockets.forEach(socket => socket.handshake.session.user !== currentPlayer.username && socket.handshake.session.roomId === roomId && socket.emit("play card", timeoutDuration/1000));
exports.promptOtherPlayers = promptOtherPlayers;

// Ask the other players to vote on the cards
const promptPlayersVote = (roomId, currentPlayer, timeoutDuration) => sockets.forEach(socket => socket.handshake.session.user !== currentPlayer.username && socket.handshake.session.roomId === roomId && socket.emit("vote", timeoutDuration/1000));
exports.promptPlayersVote = promptPlayersVote;
