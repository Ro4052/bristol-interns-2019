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

/* { username, cards, score } */
let players = [];

/* { username, cardId } */
let playedCards = [];

/* { username, cardId } */
let votes = [];

/* Get the list of cards for a specific player */
const getCardsByUsername = (username) => players.find(player => player.username === username).cards;

/* Returns true if this is the current player */
exports.isCurrentPlayer = (username) => currentPlayer.username === username;

/* Get the list of unplayed cards for a specific player */
exports.getUnplayedCardsByUsername = (username) => players.find(player => player.username === username).cards.filter(card => card.played === false);

/* Returns true if the player is able to join the game, false otherwise */
exports.canJoinGame = (username) => (status === statusTypes.NOT_STARTED && !players.some(player => player.username === username));

/* Return the list of players, hiding their assigned cards */
const getPlayers = () => players.map(player => ({ username: player.username, score: player.score }));
exports.getPlayers = getPlayers;

/* Return the list of cards played this round, hiding who played them */
const getPlayedCards = () => playedCards.map(card => ({ cardId: card.cardId }));
exports.getPlayedCards = getPlayedCards;

/* Add the player to the game if possible */
exports.joinGame = (user, callback) => {
    const cards = cardManager.assign(players, rounds);
    const player = {
        username: user.username,
        cards: cards,
        score: 0
    }
    players.push(player);
    callback();
}

/* Remove player from current game */
exports.quitGame = player => {
    if (status === statusTypes.NOT_STARTED && !players.includes(player)) {
        players = players.filter((otherPlayer) => otherPlayer !== player);
        socket.emitPlayers(getPlayers());
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
        // TODO: There aren't yet enough players in the game
    }
}

/* End the game */
exports.endGame = () => {
    status = statusTypes.NOT_STARTED;
    currentPlayer = null;
    currentWord = '';
    roundNum = 0;
    players = [];
    playedCards = [];
    votes = [];
}

/* Move on to the next round, called when all players have finished their turn */
const nextRound = () => {
    if (roundNum < rounds) {
        status = statusTypes.WAITING_FOR_CURRENT_PLAYER;
        roundNum++;
        currentPlayer = players[roundNum % players.length];
        currentWord = '';
        playedCards = [];
        votes = [];
        socket.emitNewRound(status, roundNum, currentPlayer);
        socket.promptCurrentPlayer(currentPlayer);
    } else {
        status = statusTypes.GAME_OVER;
        // TODO: Emit game over and final scores/winner
    }
}

/* The storyteller plays a card and a word */
exports.playCardAndWord = (username, cardId, word) => {
    if (status === statusTypes.WAITING_FOR_CURRENT_PLAYER && currentPlayer.username === username && !playerHasPlayedCard(username)) {
        const card = {
            username: username,
            cardId: cardId
        };
        playedCards.push(card);
        getCardsByUsername(username).find(playedCard => playedCard.id.toString() === cardId).played = true;
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
        playedCards.push(card);
        getCardsByUsername(username).find(playedCard => playedCard.id.toString() === cardId).played = true;
        if (allPlayersPlayedCard()) {
            status = statusTypes.WAITING_FOR_VOTES;
            socket.emitPlayedCards(getPlayedCards());
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
        if (allPlayersVoted()) {
            calcScores();
            nextRound();
        }
    }
}

/* Calculate the scores for this round */
const calcScores = () => {
    const correctCard = playedCards.find(card => card.userId === currentPlayer.userId);
    const correctVotes = votes.filter(vote => vote.cardId === correctCard.cardId);
    if ((correctVotes.length % votes.length) === 0) {
        players.forEach(player => {if (player !== currentPlayer) player.score += 2});
    } else {
        currentPlayer.score += 3;
        correctVotes.forEach(vote => players.find(player => player.username === vote.username).score += 3);
        votes.filter(vote => vote.cardId !== correctCard.cardId).map(vote => playedCards.find(card => vote.cardId === card.cardId)).forEach(card => players.find(player => player.username === card.username).score += 1);
    }
    socket.emitPlayers(getPlayers());
}

/* Return true if the player has already played this round */
const playerHasPlayedCard = (username) => playedCards.some(card => card.username === username);

/* Return true if the player has already voted this round */
const playerHasVoted = (username) => votes.some(vote => vote.username === username);

/* Returns true if all players have played a card this round */
const allPlayersPlayedCard = () => players.every(player => playerHasPlayedCard(player.username));

/* Returns true if all players (apart from the current player) have voted this round */
const allPlayersVoted = () => players.every(player => player.username === currentPlayer.username || playerHasVoted(player.username));
