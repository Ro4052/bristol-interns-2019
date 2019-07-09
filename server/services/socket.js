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
        socket.on('refresh', () => {
            sendInfoOnRefresh(socket);
        })
    });
}

// Check if it's the sender's turn
const sendInfoOnRefresh = (socket) => {
    const isPlayerInCurrentGame = gameLogic.getPlayers().some(player => socket.handshake.session.user === player.username);
    if (isPlayerInCurrentGame) {
        socket.emit("round info", {
            status: gameLogic.getStatus(),
            roundNum: gameLogic.getRoundNumber(),
            currentPlayer: gameLogic.getCurrentPlayer(),
            currentWord: gameLogic.getWord(),
            currentCards: gameLogic.getCards()
        });
    } else {
        // TODO
        // What happens if player is not in the current game
    }
}
exports.sendInfoOnRefresh = sendInfoOnRefresh;

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
    // console.log("emitAllPlayers", players);
    io.emit("players", {
        players: players
    });
}
exports.emitPlayers = emitPlayers;

// Let the players know about the next round
exports.emitNewRound = (status, roundNum, currentPlayer) => {
    // console.log("emitNewRound");
    io.emit("new round", {
        status: status,
        roundNum: roundNum,
        currentPlayer: currentPlayer
    });
}

// Emit the new status of the game
exports.emitStatus = status => {
    // console.log("emitStatus", status);
    io.emit("status", {
        status: status
    });
}

// Tell all the players what word was played
exports.emitWord = word => {
    // console.log("emitWord");
    io.emit("played word", word);
}

// When everyone has played their cards, send them all to the players
exports.emitPlayedCards = cards => {
    // console.log("emitPlayedCards", cards);
    io.emit("played cards", cards);
}

// Ask the current player for a word and a card
const promptCurrentPlayer = currentPlayer => {
    // console.log("promptCurrentPlayer", currentPlayer.username);
    for (let socket of sockets) {
        if (socket.handshake.session.user === currentPlayer.username) {
            socket.emit("play word and card");
        }
    }
}
exports.promptCurrentPlayer = promptCurrentPlayer;

// Ask the other players for a card
const promptOtherPlayers = currentPlayer => {
    // console.log("promptOtherPlayers");
    for (let socket of sockets) {
        if (socket.handshake.session.user !== currentPlayer.username) {
            socket.emit("play card");
        }
    }
}
exports.promptOtherPlayers = promptOtherPlayers;

// Ask the other players to vote on the cards
const promptPlayersVote = currentPlayer => {
    // console.log("promptPlayersVotes");
    for (let socket of sockets) {
        if (socket.handshake.session.user !== currentPlayer.username) {
            socket.emit("vote");
        }
    }
}
exports.promptPlayersVote = promptPlayersVote