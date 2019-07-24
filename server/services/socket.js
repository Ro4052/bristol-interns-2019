const socketio = require('socket.io');
const sharedsession = require("express-socket.io-session");
const gameLogic = require('./gameLogic');

let io;
let sockets = [];

let playCardTimeout;
let voteTimeout;

exports.setupSocket = (server, session) => {
    io = socketio(server);
    io.use(sharedsession(session));
    io.on('connection', function (socket) {
        if (socket.handshake.session.user) {
            sockets = sockets.filter(otherSocket => otherSocket.handshake.session.user !== socket.handshake.session.user);
            sockets.push(socket);
            emitPlayers(gameLogic.getPlayers());
        }
        socket.on('disconnect', function (disconnected) {
            sockets = sockets.filter(socket => socket !== disconnected);
        });
    });
}

// Create a room
exports.createRoom = (username, roomId) => {    
    let socket = sockets.find(socket => socket.handshake.session.user === username);
    socket.join(`room-${roomId}`);
    emitPlayersInRoom(roomId, gameLogic.getPlayers());
};

exports.closeSocket = () => {
    sockets.forEach(socket => socket.disconnect());
    sockets = [];
};

// Check if it's the sender's turn
exports.isCurrentPlayerSocket = socket => gameLogic.getGameState().currentPlayer && socket.handshake.session.user === gameLogic.getGameState().currentPlayer.username;

// Emit all the players
const emitPlayers = players => io.emit("players", { players });
exports.emitPlayers = emitPlayers;

// Emit all the players in a room
const emitPlayersInRoom = (id, players) => io.sockets.in(`room-${id}`).emit("players", { players });
exports.emitPlayersInRoom = emitPlayersInRoom;

// Let the players know about the next round
exports.emitNewRound = (status, roundNum, currentPlayer) => io.emit("new round", { status, roundNum, currentPlayer });

// Emit the new status of the game
exports.emitStatus = status => io.emit("status", { status });

// Tell all the players what word was played
exports.emitWord = word => io.emit("played word", word);

exports.emitPlayedCard = (username, card) => {
    const socket = sockets.find(socket => socket.handshake.session.user === username);
    if (socket) socket.emit("played card", card);
};

// When everyone has played their cards, send them all to the players
exports.emitPlayedCards = cards => io.emit("played cards", cards);

// When everyone has played their cards, send them all to the players
exports.emitAllVotes = votes => io.emit("all votes", votes);

// When game is over, emit the winner to everyone
exports.emitWinner = player => io.emit("winner", player);

// When game is over, tell the users
exports.emitEndGame = () => io.emit("end");

// Ask the current player for a word and a card
const promptCurrentPlayer = currentPlayer => {
    let current = sockets.find(socket => socket.handshake.session.user === currentPlayer.username)
    if (current) current.emit("play word and card");
};
exports.promptCurrentPlayer = promptCurrentPlayer;

// Ask the other players for a card
const promptOtherPlayers = currentPlayer => {
    sockets.forEach(socket => socket.handshake.session.user !== currentPlayer.username && socket.emit("play card"))
    playCardTimeout = setTimeout(gameLogic.playRandomCard, 3000);
};
exports.promptOtherPlayers = promptOtherPlayers;

// Ask the other players to vote on the cards
const promptPlayersVote = currentPlayer => {
    sockets.forEach(socket => socket.handshake.session.user !== currentPlayer.username && socket.emit("vote"));
    voteTimeout = setTimeout(gameLogic.emitVotes, 30000);
};
exports.promptPlayersVote = promptPlayersVote;

exports.clearTimeouts = () => {
    clearTimeout(playCardTimeout);
    clearTimeout(voteTimeout);
};
