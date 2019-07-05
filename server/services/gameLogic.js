const socket = require('./socket');

const statusTypes = {
    NOT_STARTED: "NOT_STARTED",
    WAITING_FOR_CURRENT_PLAYER: "WAITING_FOR_CURRENT_PLAYER",
    WAITING_FOR_OTHER_PLAYERS: "WAITING_FOR_OTHER_PLAYERS",
    WAITING_FOR_VOTES: "WAITING_FOR_VOTES",
    GAME_OVER: "GAME_OVER"
};

let status = statusTypes.NOT_STARTED;
let roundNum = 0;
let currentPlayer;
let allPlayers = [];
let cardsPlayed = [];
let currentCard;
let otherCards = [];
let currentWord = '';
let votes = [];

let gameState = {
    status: statusTypes.NOT_STARTED,
    started: false, // Going to remove eventually using status instead
    roundNum: 0,
    currentPlayer: null,
    players: [],
    currentCards: [],
    currentCardId: null,
    currentWord: "",
    votes: []
};

/* Return the current game state */
exports.getGameState = () => {
    return gameState;
    // return {
    //     status: status,
    //     roundNum: roundNum,
    //     currentPlayer: currentPlayer,
    //     allPlayers: allPlayers,
    //     cardsPlayed: cardsPlayed,
    //     currentCard: currentCard,
    //     otherCards: otherCards,
    //     currentWord: currentWord,
    //     votes: votes
    // };
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
        status: statusTypes.WAITING_FOR_CURRENT_PLAYER,
    };
    socket.emitGameState();
    socket.promptCurrentPlayer();
}

/* The player whose turn it is plays a card and a word */
exports.playCardAndWord = (username, cardId, word) => {
    if (gameState.status === statusTypes.WAITING_FOR_CURRENT_PLAYER && gameState.currentPlayer.username === username) {
        console.log("Current player has played card and word");
        gameState.players[getPlayerIndexByUsername(username)].playedCard = true;
        gameState.currentCards.push({id: cardId, hidden: true});
        gameState = {
            ...gameState,
            status: statusTypes.WAITING_FOR_OTHER_PLAYERS,
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
exports.playCard = (username, card) => {
    console.log("playCard", card);
    if (gameState.status === statusTypes.WAITING_FOR_OTHER_PLAYERS && !gameState.players[getPlayerIndexByUsername(username)].playedCard) {
        gameState.currentCards.push({id: card, hidden: true});
        gameState.players[getPlayerIndexByUsername(username)].playedCard = true;
        if (allPlayersPlayedCard()) {
            gameState.status = statusTypes.WAITING_FOR_VOTES;
            socket.emitPlayedCards(gameState.currentCards);
            socket.promptPlayersVote();
        } else socket.emitGameState();
    }
}

/* Vote for a card */
exports.voteCard = (username, card) => {
    console.log("voteCard/end turn");
    if (gameState.status === statusTypes.WAITING_FOR_VOTES && !gameState.players[getPlayerIndexByUsername(username)].voted) {
        gameState.votes.push({id: card, user: username});
        gameState.players[getPlayerIndexByUsername(username)].voted = true;
        if (allPlayersVoted()) {
            incrementRound();
        } else socket.emitGameState();
    }
}

/* Get the index of the player in the list */
const getPlayerIndexByUsername = username => {
    return gameState.players.findIndex(player => player.username === username);
}

/* Move on to the next round, called when all players have finished their turn */
const incrementRound = () => {
    console.log("Everyone done, next round!");
    gameState.roundNum++;
    gameState.players = gameState.players.map(player => {
        return {...player, playedCard: false, voted: false};
    });
    gameState.currentPlayer = gameState.players[gameState.roundNum % gameState.players.length];
    gameState.currentCards = [];
    gameState.currentWord = '';
    socket.emitGameState();
    socket.promptCurrentPlayer();
}

/* Returns true if all players have played a card this round */
const allPlayersPlayedCard = () => {
    for (let player of gameState.players.filter(player => gameState.currentPlayer !== player)) {
        if (!player.playedCard) return false;
    }
    return true;
}

/* Returns true if all players have voted this round */
const allPlayersVoted = () => {
    for (let player of gameState.players.filter(player => gameState.currentPlayer !== player)) {
        if (!player.voted) return false;
    }
    return true;
}
