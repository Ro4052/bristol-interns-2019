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
            if (checkCurrentTurn(socket)) {
                gameLogic.setCurrentWord(msg);
                emitGameState();
            }        
        });

        socket.on('play card', (cardID) => {
            if (checkCurrentTurn(socket)) {
                gameLogic.playCard(cardID)
                emitGameState();
            }
        });
    });
}

// Emit the current game state to all players
const emitGameState = exports.emitGameState = () => {
    for (let socket of sockets) {
        let gameState = {...gameLogic.getGameState(), myTurn: checkCurrentTurn(socket)}
        socket.emit("gameState", gameState);
    }
}

// Check if it's the sender's turn
const checkCurrentTurn = (socket) => {
    if (gameLogic.getGameState().currentPlayer) {
        return (socket.handshake.session.user === gameLogic.getGameState().currentPlayer.username)
    } else {
        return false;
    }
}
