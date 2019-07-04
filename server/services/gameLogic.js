const socket = require('./socket');

const status = {
    NOT_STARTED: "NOT_STARTED",
    WAITING_FOR_CURRENT_PLAYER: "WAITING_FOR_CURRENT_PLAYER",
    WAITING_FOR_OTHER_PLAYERS: "WAITING_FOR_OTHER_PLAYERS",
    GAME_OVER: "GAME_OVER"
};

let gameState = {
    status: status.NOT_STARTED,
    started: false, // Going to remove eventually using status instead
    roundNum: 0,
    currentPlayer: null,
    players: [],
    currentCards: [],
    currentCardId: null,
    currentWord: ""
};

/* Return the current game state */
exports.getGameState = () => {
    return gameState;
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
        // - Max players reached
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
    gameState = {
        ...gameState,
        started: true,
        currentPlayer: gameState.players[0],
        status: status.WAITING_FOR_CURRENT_PLAYER,
    };
    socket.emitGameState();
    socket.promptCurrentPlayer();
}

/* The player whose turn it is plays a card and a word */
exports.playCardAndWord = (username, cardId, word) => {
    if (gameState.status === status.WAITING_FOR_CURRENT_PLAYER && gameState.currentPlayer.username === username) {
        console.log("Current player is ending their turn!");
        gameState = {
            ...gameState,
            status: status.WAITING_FOR_OTHER_PLAYERS,
            currentWord: word,
            currentCardId: cardId
        };
        socket.emitGameState();
        socket.emitWord(word);
        socket.promptOtherPlayers();
    } else {
        // Error or nothing?
    }
}

/* Adds player's card to list of played cards */
exports.playCard = card => {
    // if (gameState.status === status.WAITING_FOR_OTHER_PLAYERS)
    gameState.currentCards.push({id: card, hidden: true});
    socket.emitGameState();
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
    socket.promptCurrentPlayer();
}

/* Returns true if all players have finished the current turn */
const allPlayersFinishedTurn = () => {
    for (let player of gameState.players) {
        if (!player.finishedTurn) return false;
    }
    return true;
}
