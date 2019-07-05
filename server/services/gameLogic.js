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

/* Return the list of players */
exports.getAllPlayers = () => {
    return allPlayers;
}

/* Add the player to the game if possible */
exports.joinGame = player => {
    // console.log("Attempting to join game");
    if (status === statusTypes.NOT_STARTED && !allPlayers.includes(player)) {
        // console.log("Join game successful");
        allPlayers.push(player);
    } else {
        // TODO
        // - Game has started, player can't join
        // - Player has already joined
        // - Max players reached
    }
}

/* Remove player from current game */
exports.quitGame = player => {
    if (status === statusTypes.NOT_STARTED && !allPlayers.includes(player)) {
        allPlayers = allPlayers.filter((otherPlayer) => otherPlayer !== player);
        socket.emitAllPlayers();
        return true;
    } else {
        // Game has started, player can't quit
        return false;
    }
}

/* Start the game with the players that have joined */
exports.startGame = () => {
    // TODO: Min players
    status = statusTypes.WAITING_FOR_CURRENT_PLAYER;
    currentPlayer = allPlayers[0];
    socket.emitStartGame(allPlayers, status);
    socket.emitNewRound(status, roundNum, currentPlayer);
    socket.promptCurrentPlayer(currentPlayer);
}

/* The player whose turn it is plays a card and a word */
exports.playCardAndWord = (username, cardId, word) => {
    if (status === statusTypes.WAITING_FOR_CURRENT_PLAYER && currentPlayer.username === username) {
        console.log("Current player has played card and word");
        allPlayers[getPlayerIndexByUsername(username)].playedCard = true;
        cardsPlayed.push({id: cardId, hidden: true});
        status = statusTypes.WAITING_FOR_OTHER_PLAYERS;
        socket.emitStatus(status);
        currentWord = word;
        socket.emitWord(currentWord);
        currentCard = cardId;
        socket.promptOtherPlayers(currentPlayer);
    } else {
        // Error or nothing?
    }
}

/* Adds player's card to list of played cards */
exports.playCard = (username, card) => {
    console.log("playCard", card);
    if (status === statusTypes.WAITING_FOR_OTHER_PLAYERS && !allPlayers[getPlayerIndexByUsername(username)].playedCard) {
        cardsPlayed.push({id: card, hidden: true});
        allPlayers[getPlayerIndexByUsername(username)].playedCard = true;
        if (allPlayersPlayedCard()) {
            status = statusTypes.WAITING_FOR_VOTES;
            socket.emitPlayedCards(cardsPlayed);
            socket.promptPlayersVote(currentPlayer);
        }
    }
}

/* Vote for a card */
exports.voteCard = (username, card) => {
    // console.log("voteCard/end turn");
    if (status === statusTypes.WAITING_FOR_VOTES && !allPlayers[getPlayerIndexByUsername(username)].voted) {
        votes.push({id: card, user: username});
        allPlayers[getPlayerIndexByUsername(username)].voted = true;
        if (allPlayersVoted()) {
            incrementRound();
        }
    }
}

/* Get the index of the player in the list */
const getPlayerIndexByUsername = username => {
    return allPlayers.findIndex(player => player.username === username);
}

/* Move on to the next round, called when all players have finished their turn */
const incrementRound = () => {
    // console.log("Everyone done, next round!");
    roundNum++;
    allPlayers = allPlayers.map(player => {
        return {...player, playedCard: false, voted: false};
    });
    currentPlayer = allPlayers[roundNum % allPlayers.length];
    cardsPlayed = [];
    currentWord = '';
    socket.promptCurrentPlayer(currentPlayer);
}

/* Returns true if all players have played a card this round */
const allPlayersPlayedCard = () => {
    for (let player of allPlayers.filter(player => currentPlayer !== player)) {
        if (!player.playedCard) return false;
    }
    return true;
}

/* Returns true if all players have voted this round */
const allPlayersVoted = () => {
    for (let player of allPlayers.filter(player => currentPlayer !== player)) {
        if (!player.voted) return false;
    }
    return true;
}
