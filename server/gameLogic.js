const socket = require('./socket');

let gameState = {
    started: false,
    roundNum: 0,
    currentPlayer: null,
    players: [],
    currentCards: [],
    currentWord: ""
};

/* Return the current game state */
exports.getGameState = () => {
    return gameState;
}

exports.setCurrentWord = (word) => {
    gameState = {...gameState, currentWord: word};
    socket.emitGameState();
}

/* Add the player to the game if possible */
exports.joinGame = player => {
    if (!gameState.started && !gameState.players.includes(player)) {
        gameState.players.push(player);
        socket.emitGameState();
    } else {
        // TODO
        // - Game has started, player can't join
        // - Player has already joined
    }
}

/* Remove player from current game */
exports.quitGame = player => {
    if (!gameState.started && gameState.players.includes(player)) {
        gameState.players = gameState.players.filter((otherPlayer) => otherPlayer !== player);
        socket.emitGameState();
        return true;
    } else {
        // Game has started, player can't quit
        return false;
    }
}

/* Start the game with the players that have joined */
exports.startGame = () => {
    // TODO: Min players
    gameState.started = true;
    gameState.currentPlayer = gameState.players[0];
    socket.emitGameState();
}

/* Call when a player finishes their turn */
exports.endPlayerTurn = username => {
    gameState.players[getPlayerIndexByUsername(username)].finishedTurn = true;
    if (allPlayersFinishedTurn()) incrementRound();
}

/* Get the index of the player in the list */
const getPlayerIndexByUsername = username => {
    return gameState.players.findIndex(player => player.username === username);
}

/* Move on to the next round, called when all players have finished their turn */
const incrementRound = () => {
    gameState.roundNum++;
    gameState.players = gameState.players.map(player => {
        return {...player, finishedTurn: false};
    });
    gameState.currentPlayer = gameState.players[gameState.roundNum % gameState.players.length];
    gameState.currentCards = [];
    gameState.currentWord = '';
    socket.emitGameState();
}

/* Returns true if all players have finished the current turn */
const allPlayersFinishedTurn = () => {
    for (let player of gameState.players) {
        if (!player.finishedTurn) return false;
    }
    return true;
}

/* Adds player's card to list of played cards */
exports.playCard = card => {
    gameState.currentCards.push({id: card, hidden: true});
    socket.emitGameState();
}