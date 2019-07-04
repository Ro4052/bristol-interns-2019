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

        socket.on('play word', function (msg) {
            if (isCurrentPlayerSocket(socket)) {
                gameLogic.setCurrentWord(msg);
                emitGameState();
            }        
        });

        socket.on('play card', (cardID) => {
            if (isCurrentPlayerSocket(socket)) {
                gameLogic.playCard(cardID)
                emitGameState();
            }
        });
    });
}

// Emit the current game state to all players
const emitGameState = exports.emitGameState = () => {
    for (let socket of sockets) {
        let gameState = {...gameLogic.getGameState(), myTurn: isCurrentPlayerSocket(socket)}
        socket.emit("gameState", gameState);
    }
}

// Ask the current player for a word and a card
const promptCurrentPlayer = exports.promptCurrentPlayer = () => {
    for (let socket of sockets) {
        if (socket.handshake.session.user === gameLogic.getGameState().currentPlayer.username) {
            socket.emit("play word and card");
        }
    }
}

// Tell all the players what word was played
const emitWord = exports.emitWord = word => {
    io.emit("played word", word);
}

// Ask the other players for a card
const promptOtherPlayer = exports.promptOtherPlayer = () => {
    for (let socket of sockets) {
        if (socket.handshake.session.user !== gameLogic.getGameState().currentPlayer.username) {
            socket.emit("play card");
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
