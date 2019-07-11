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
        emitPlayers(gameLogic.getPlayers());
    });
}

exports.closeSocket = () => {
    sockets.forEach(socket => {
        socket.disconnect();
    });
    sockets = [];
}

// Check if it's the sender's turn
exports.isCurrentPlayerSocket = (socket) => {
    if (gameLogic.getGameState().currentPlayer) {
        return (socket.handshake.session.user === gameLogic.getGameState().currentPlayer.username)
    } else {
        return false;
    }
}

// Emit all the players
const emitPlayers = players => {
    io.emit("players", {
        players: players
    });
}
exports.emitPlayers = emitPlayers;

// Let the players know about the next round
exports.emitNewRound = (status, roundNum, currentPlayer) => {
    io.emit("new round", {
        status: status,
        roundNum: roundNum,
        currentPlayer: currentPlayer
    });
}

// Emit the new status of the game
exports.emitStatus = status => {
    io.emit("status", {
        status: status
    });
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
const promptCurrentPlayer = currentPlayer => {
    sockets.find(socket => socket.handshake.session.user === currentPlayer.username).emit("play word and card");
}
exports.promptCurrentPlayer = promptCurrentPlayer;

// Ask the other players for a card
const promptOtherPlayers = currentPlayer => {
    for (let socket of sockets) {
        if (socket.handshake.session.user !== currentPlayer.username) {
            socket.emit("play card");
        }
    }
}
exports.promptOtherPlayers = promptOtherPlayers;

// Ask the other players to vote on the cards
const promptPlayersVote = currentPlayer => {
    for (let socket of sockets) {
        if (socket.handshake.session.user !== currentPlayer.username) {
            socket.emit("vote");
        }
    }
}
exports.promptPlayersVote = promptPlayersVote
