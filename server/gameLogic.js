let gameState = {
    started: false,
    roundNum: 0,
    currentPlayer: null,
    players: []
};

/* Return the current game state */
exports.getGameState = () => {
    return gameState;
}

/* Add the player to the game if possible */
exports.joinGame = player => {
    if (!gameState.started && !gameState.players.includes(player)) {
        player = {...player, "finishedTurn": false};
        gameState.players.push(player);
    } else {
        // TODO
        // - Game has started, player can't join
        // - Player has already joined
    }
}

/* Start the game with the players that have joined */
exports.startGame = () => {
    // TODO: Min players
    gameState.started = true;
    gameState.currentPlayer = gameState.players[0];
}

/* Call when a player finishes their turn */
exports.endPlayerTurn = username => {
    gameState.players[getPlayerByUsername(username)].finishedTurn = true;
    if (allPlayersFinishedTurn()) incrementRound();
}

/* Get the index of the player in the list */
const getPlayerByUsername = username => {
    return gameState.players.findIndex(player => player.username === username);
}

/* Move on to the next round, called when all players have finished their turn */
const incrementRound = () => {
    console.log("End of round!");
    gameState.roundNum++;
    gameState.players = gameState.players.map(player => {
        return {...player, "finishedTurn": false}
    });
    gameState.currentPlayer = gameState.players[gameState.roundNum % gameState.players.length];
}

/* Returns true if all players have finished the current turn */
const allPlayersFinishedTurn = () => {
    for (let player of gameState.players) {
        if (!player.finishedTurn) return false;
    }
    return true;
}