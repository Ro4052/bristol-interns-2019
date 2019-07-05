const socketio = require('socket.io');
const sharedsession = require("express-socket.io-session");
const gameLogic = require('./gameLogic');

let io;
let sockets = [];

exports.setupSocket = (server, session) => {
    io = socketio(server);
    io.use(sharedsession(session));
    io.on('connection', function (socket) {
        sockets.push(socket);
        emitGameState();
    });
}

// Emit the current game state to all players
const emitGameState = exports.emitGameState = () => {
    for (let socket of sockets) {
        let gameState = {...gameLogic.getGameState(), myTurn: isCurrentPlayerSocket(socket)}
        socket.emit("gameState", gameState);
    }
}

// Tell all the players what word was played
exports.emitWord = word => {
    io.emit("played word", word);
}

// When everyone has played their cards, send them all to the players
exports.emitPlayedCards = cards => {
    io.emit("played cards", cards);
}

// Ask the current player for a word and a card
exports.promptCurrentPlayer = () => {
    for (let socket of sockets) {
        if (socket.handshake.session.user === gameLogic.getGameState().currentPlayer.username) {
            socket.emit("play word and card");
        }
    }
}

// Ask the other players for a card
exports.promptOtherPlayers = () => {
    for (let socket of sockets) {
        if (socket.handshake.session.user !== gameLogic.getGameState().currentPlayer.username) {
            socket.emit("play card");
        }
    }
}

exports.promptPlayersVote = () => {
    for (let socket of sockets) {
        if (socket.handshake.session.user !== gameLogic.getGameState().currentPlayer.username) {
            socket.emit("vote");
        }
    }
}

// Check if it's the sender's turn
const isCurrentPlayerSocket = exports.isCurrentPlayerSocket = (socket) => {
    if (gameLogic.getGameState().currentPlayer) {
        return (socket.handshake.session.user === gameLogic.getGameState().currentPlayer.username)
    } else {
        return false;
    }
}
