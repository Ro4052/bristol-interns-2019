const socket = require('./socket');
const cardManager = require('../services/cards');

const statusTypes = {
    NOT_STARTED: "NOT_STARTED",
    STARTED: "STARTED",
    WAITING_FOR_CURRENT_PLAYER: "WAITING_FOR_CURRENT_PLAYER",
    WAITING_FOR_OTHER_PLAYERS: "WAITING_FOR_OTHER_PLAYERS",
    WAITING_FOR_VOTES: "WAITING_FOR_VOTES",
    DISPLAY_ALL_VOTES: "DISPLAY_ALL_VOTES",
    GAME_OVER: "GAME_OVER"
};

const rounds = 3;
const minPlayers = 0;

let status = statusTypes.NOT_STARTED;
let roundNum = 0;
let currentPlayer;
let currentWord = '';

/** @type {{ username: string, cards: {{ cardId: number, played: bool }[]}, score: number }[]} */
let players = [];

/** @type {{ username: string, cardId: number }[]} */
let playedCards = [];

/** @type {{ username: string, cardId: number }[]} */
let votes = [];

/* Remove player from list of players on log out */
exports.removePlayer = (username) => {
    players = players.filter(player => player.username !== username);
    socket.emitPlayers(players);
};

/* Set the status of the game */
const setStatus = (newStatus) => status = newStatus;
exports.setStatus = setStatus;

/* Get the list of cards for a specific player */
const getCardsByUsername = (username) => players.find(player => player.username === username).cards;

/* Returns true if this is the current player */
exports.isCurrentPlayer = (username) => currentPlayer.username === username;

/* Get the list of unplayed cards for a specific player */
exports.getUnplayedCardsByUsername = (username) => players.find(player => player.username === username).cards.filter(card => !card.played);

/* Returns true if the player is able to join the game, false otherwise */
exports.canJoinGame = (username) => (status === statusTypes.NOT_STARTED && !players.some(player => player.username === username));

/* Return the list of players, hiding their assigned cards */
const getPlayers = () => players.map(player => ({ username: player.username, score: player.score }));
exports.getPlayers = getPlayers;

/* Return the list of cards played this round, hiding who played them */
const getPlayedCards = () => playedCards.map(card => ({ cardId: card.cardId })).sort(() => .5 - Math.random());
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
exports.quitGame = username => {    
    if (status === statusTypes.NOT_STARTED && players.some(player => player.username === username)) {
        players = players.filter((otherPlayer) => otherPlayer.username !== username);
        socket.emitPlayers(getPlayers());
    } else {
        // Game has started, player can't quit, server is responsible for generating the error
        throw Error("Cannot log out of a running game.");
    }
}

/* Start the game with the players that have joined */
exports.startGame = () => {
    if (status === statusTypes.NOT_STARTED && players.length >= minPlayers) {
        setStatus(statusTypes.STARTED);
        nextRound();
    } else {
        // There aren't yet enough players in the game, server is responsible for generating the error
        throw Error("Cannot start game. Insufficient number of players");
    }
}

/* End the game */
exports.endGame = () => {
    if (status === statusTypes.GAME_OVER) {
        socket.emitEndGame();
        clearGameState();
    } else {
        // Game is currently running and cannot be ended, server is responsible for generating the error
        throw Error("Cannot end game. Game is currently running");
    } 
}

/* Move on to the next round, called when all players have finished their turn */
const nextRound = () => {
    if (roundNum < rounds) {
        setStatus(statusTypes.WAITING_FOR_CURRENT_PLAYER);
        roundNum++;
        currentPlayer = players[roundNum % players.length];
        clearRoundData();
        socket.emitNewRound(status, roundNum, currentPlayer);
        socket.promptCurrentPlayer(currentPlayer);
    } else {
        status = statusTypes.GAME_OVER;
        socket.emitStatus(status);
        const winner = players.reduce((prev, current) => (prev.score > current.score) ? prev : current);
        socket.emitWinner({ username: winner.username });
    }
}

/* The storyteller plays a card and a word */
exports.playCardAndWord = (username, cardId, word) => {
    if (status === statusTypes.WAITING_FOR_CURRENT_PLAYER && !playerHasPlayedCard(username)) {
        const card = { username, cardId };
        playedCards.push(card);
        getCardsByUsername(username).find(playedCard => playedCard.cardId === cardId).played = true;
        status = statusTypes.WAITING_FOR_OTHER_PLAYERS;
        socket.emitStatus(status);
        currentWord = word;
        socket.emitWord(currentWord);
        socket.promptOtherPlayers(currentPlayer);
    } else {
        // Cannot play card and word, the user sending the request is not the current player, the player has already played a card,
        // or the game status is not appropriate for the request, server is responsible for generating an error
        throw Error("You cannot play more than one card and one word, or now is not the right time to play a card and a word.");
    }
}

/* Adds player's card to list of played cards */
exports.playCard = (username, cardId) => {
    if (status === statusTypes.WAITING_FOR_OTHER_PLAYERS && !playerHasPlayedCard(username)) {
        const card = { username, cardId };
        playedCards.push(card);
        getCardsByUsername(username).find(playedCard => playedCard.cardId === cardId).played = true;
        if (allPlayersPlayedCard()) {
            emitPlayedCards();
        }
    } else {
        // Cannot play card, the player has already played a card, or the game status is not
        // appropriate for the request, server is responsible for generating an error.
        throw Error("You cannot play more than one card, or now is not the right time to play a card.");
    }
}

/* Vote for a card */
exports.voteCard = (username, cardId) => {
    if (status === statusTypes.WAITING_FOR_VOTES && !playerHasVoted(username)) {
        const vote = { username, cardId };
        votes.push(vote);
        if (allPlayersVoted()) {
            emitVotes();
        }
    } else {
        // Cannot vote for card, the player has already voted for a card, or the game status is not
        // appropriate for the request, server is responsible for generating an error.
        throw Error("You cannot vote for a card more than once, or now is not the right time to vote.");
    }
}

/*  */
exports.emitVotes = () => {
    setStatus(statusTypes.DISPLAY_ALL_VOTES);
    socket.emitStatus(status);
    socket.emitAllVotes(votes);
    calcScores();
    setTimeout(() => nextRound(), 5000);
};

exports.emitPlayedCards = () => {
    status = statusTypes.WAITING_FOR_VOTES;
    socket.emitPlayedCards(getPlayedCards());
    socket.promptPlayersVote(currentPlayer);
};

/* Calculate the scores for this round */
const calcScores = () => {
    const correctCard = playedCards.find(card => card.userId === currentPlayer.userId);
    const correctVotes = votes.filter(vote => vote.cardId === correctCard.cardId);
    if ((correctVotes.length % votes.length) === 0) {
        players.forEach(player => {if (player !== currentPlayer) player.score += 2});
    } else {
        currentPlayer.score += 3;
        correctVotes.forEach(vote => players.find(player => player.username === vote.username).score += 3);
        votes.filter(vote => vote.cardId !== correctCard.cardId).forEach(vote => {
            const votedCard = playedCards.find(card => card.cardId === vote.cardId);
            players.find(player => player.username === votedCard.username).score += 1;
        });
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

/* Clean up stored data */
const clearRoundData = () => {
    currentWord = '';
    playedCards = [];
    votes = [];
}

/* Clear entire game state */
const clearGameState = () => {
    clearRoundData();
    setStatus(statusTypes.NOT_STARTED);
    currentPlayer = null;
    roundNum = 0;
    players = [];
}