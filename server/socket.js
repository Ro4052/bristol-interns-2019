const socketio = require('socket.io');
const sharedsession = require("express-socket.io-session");
const gameLogic = require('./gameLogic');

let io;
let sockets = [];

let globalMessage = '';

exports.setupSocket = (server, session) => {
    io = socketio(server);
    io.use(sharedsession(session));
    io.on('connection', function (socket) {
        sockets.push(socket);
        emitGameState();

        socket.on('private message', function (msg) {
            if (checkCurrentTurn(socket)) {
                console.log('I received a private message saying ', msg);
                globalMessage = msg;
                io.emit("messages", globalMessage);
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
    console.log("emitGameState");
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
