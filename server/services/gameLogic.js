const socket = require('./socket');
const cardManager = require('../services/cards');

const statusTypes = {
    NOT_STARTED: "NOT_STARTED",
    STARTED: "STARTED",
    WAITING_FOR_CURRENT_PLAYER: "WAITING_FOR_CURRENT_PLAYER",
    WAITING_FOR_OTHER_PLAYERS: "WAITING_FOR_OTHER_PLAYERS",
    WAITING_FOR_VOTES: "WAITING_FOR_VOTES",
    GAME_OVER: "GAME_OVER"
};

const rounds = 3;
const minPlayers = 0;

let status = statusTypes.NOT_STARTED;
let roundNum = 0;
let currentPlayer;
let currentWord = '';

/* {
    username,
    cards,
    score
} */
let players = [];

/* {
    username,
    cardId
} */
let cards = [];

/* {
    username,
    cardId
} */
let votes = [];

/* Return the list of players, without their assigned cards */
exports.getPlayers = () => players.map(player => ({ username: player.username, score: player.score }));

/* Return the list of cards played this round, without who played them */
const getCards = exports.getCards = () => cards.map(card => ({ cardId: card.cardId }));

/* Get the list of cards for a specific player */
exports.getCardsByUsername = (username) => players.find(player => player.username === username).cards;

/* Add the player to the game if possible */
exports.joinGame = user => {
    if (status === statusTypes.NOT_STARTED && !players.some(player => player.username === user.username)) {
        const cards = cardManager.assign(players, rounds);
        const player = {
            username: user.username,
            cards: cards,
            score: 0
        }
        players.push(player);
    } else {
        // TODO
        // - Game has started, player can't join
        // - Player has already joined
        // - Max players reached
    }
}

/* Remove player from current game */
exports.quitGame = player => {
    if (status === statusTypes.NOT_STARTED && !players.includes(player)) {
        players = players.filter((otherPlayer) => otherPlayer !== player);
        socket.emitPlayers();
        return true;
    } else {
        // Game has started, player can't quit
        return false;
    }
}

/* Start the game with the players that have joined */
exports.startGame = () => {
    if (status === statusTypes.NOT_STARTED && players.length > minPlayers) {
        status = statusTypes.STARTED;
        nextRound();
    } else {
        // TODO
        // - There aren't yet enough players in the game
    }
}

/* Move on to the next round, called when all players have finished their turn */
const nextRound = () => {
    if (roundNum !== rounds) {
        status = statusTypes.WAITING_FOR_CURRENT_PLAYER;
        roundNum++;
        currentPlayer = players[roundNum % players.length];
        currentWord = '';
        cards = [];
        votes = [];
        socket.emitNewRound(status, roundNum, currentPlayer);
        socket.promptCurrentPlayer(currentPlayer);
    } else {
        status = statusTypes.GAME_OVER;
        // TODO
        // - Emit game over and final scores/winner
    }
}

/* The player whose turn it is plays a card and a word */
exports.playCardAndWord = (username, cardId, word) => {
    if (status === statusTypes.WAITING_FOR_CURRENT_PLAYER && currentPlayer.username === username && !playerHasPlayedCard(username)) {
        const card = {
            username: username,
            cardId: cardId
        };
        cards.push(card);
        status = statusTypes.WAITING_FOR_OTHER_PLAYERS;
        socket.emitStatus(status);
        currentWord = word;
        socket.emitWord(currentWord);
        socket.promptOtherPlayers(currentPlayer);
    } else {
        // TODO: Error handling
    }
}

/* Adds player's card to list of played cards */
exports.playCard = (username, cardId) => {
    if (status === statusTypes.WAITING_FOR_OTHER_PLAYERS && !playerHasPlayedCard(username)) {
        const card = {
            username: username,
            cardId: cardId
        };
        cards.push(card);
        if (allPlayersPlayedCard()) {
            status = statusTypes.WAITING_FOR_VOTES;
            socket.emitPlayedCards(getCards());
            socket.promptPlayersVote(currentPlayer);
        }
    }
}

/* Vote for a card */
exports.voteCard = (username, cardId) => {
    if (status === statusTypes.WAITING_FOR_VOTES && !playerHasVoted(username)) {
        const vote = {
            username: username,
            cardId: cardId
        };
        votes.push(vote);
        if (allPlayersVoted()) nextRound();
    }
}

/* Return true if the player has already played this round */
const playerHasPlayedCard = (username) => cards.filter(card => card.username === username).length > 0;

/* Return true if the player has already voted this round */
const playerHasVoted = (username) => votes.filter(vote => vote.username === username).length > 0;

/* Returns true if all players have played a card this round */
const allPlayersPlayedCard = () => players.every(player => playerHasPlayedCard(player.username));

/* Returns true if all players (apart from the current player) have voted this round */
const allPlayersVoted = () => players.filter(player => player.username !== currentPlayer.username).every(player => playerHasVoted(player));
