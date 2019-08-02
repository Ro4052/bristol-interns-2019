const cardsManager = require('../services/cardsManager');
const socket = require('../services/socket');
const { statusTypes } = require('./statusTypes');

// Set durations
const promptDuration = process.env.NODE_ENV === 'testing' ? 2000 : 20000;
const nextRoundDuration = process.env.NODE_ENV === 'testing' ? 2000 : 5000;
const minPlayers = process.env.NODE_ENV === 'testing' ? 2 : 2;
exports.minPlayers = minPlayers;

class GameLogic {
    constructor(roomId, number) {
        this.roomId = roomId;
        this.rounds = number;
        this.status = statusTypes.NOT_STARTED;
        this.roundNum = 0;
        this.currentPlayer = null;
        this.currentWord = '';
        /** @type {{ username: string, cards: {{ cardId: number, played: bool }[]}, score: number }[]} */
        this.players = [];
        /** @type {{ username: string, cardId: number }[]} */
        this.playedCards = [];
        /** @type {{ username: string, cardId: number }[]} */
        this.votes = [];

        // Initialise timers
        this.playRandomCardsTimeout = null;
        this.voteTimeout = null;
        this.nextRoundTimeout = null;
    }

    /* Set the status of the game */
    setStatus(status) {
        this.status = status;
        socket.emitStatus(this.roomId, this.status);
    };

    /* Get current state of the game */
    getState(username) {
        return {
            playedCards: (this.status === statusTypes.WAITING_FOR_VOTES || this.status === statusTypes.DISPLAY_ALL_VOTES) ? this.getPlayedCards() : [],
            playCard: (!this.hasPlayedCard(username) && this.currentPlayer.username === username && this.status === statusTypes.WAITING_FOR_CURRENT_PLAYER)
                    || (!this.hasPlayedCard(username) && this.status === statusTypes.WAITING_FOR_OTHER_PLAYERS),
            playWord: this.currentPlayer.username === username && !this.currentWord && this.status === statusTypes.WAITING_FOR_CURRENT_PLAYER,
            voteCard: !this.hasVoted(username) && this.currentPlayer.username !== username && this.status === statusTypes.WAITING_FOR_VOTES,
            currentPlayer: this.currentPlayer
        }
    }

    /* Returns true if this is the current player */
    isCurrentPlayer(username) { return this.currentPlayer.username === username };

    /* Get the list of cards for a specific player */
    getCardsByUsername(username) { return this.players.find(player => player.username === username).cards };

    /* Get the list of unplayed cards for a specific player */
    getUnplayedCardsByUsername(username) { return this.players.find(player => player.username === username).cards.filter(card => !card.played) };

    /* Return the list of players, hiding their assigned cards */
    getPlayers() { return this.players.map(player => ({ username: player.username, score: player.score, finishedTurn: player.finishedTurn })) };

    /* Return the list of cards played this round, hiding who played them */
    getPlayedCards() { return cardsManager.shuffle(this.playedCards.map(card => ({ cardId: card.cardId }))) };

    /* Return an empty list of cards with size equal to the number of played cards */
    getHiddenPlayedCards() { return this.playedCards.map(() => ({})) };

    /* Return true if the player has already played this round */
    hasPlayedCard(username) { return this.playedCards.some(card => card.username === username) };

    /* Return true if the player has already voted this round */
    hasVoted(username) { return this.votes.some(vote => vote.username === username) };

    /* Returns true if all players have played a card this round */
    allPlayersPlayedCard () { return this.players.every(player => this.hasPlayedCard(player.username)) };

    /* Returns true if all players (apart from the current player) have voted this round */
    allPlayersVoted() { return this.players.every(player => player.username === this.currentPlayer.username || this.hasVoted(player.username)) };

    /* Add the player to the game if possible */
    joinGame(username) {
        if (this.status !== statusTypes.NOT_STARTED) {
            throw Error("Game has already started");
        } else if (this.players.some(player => player.username === username)) {
            throw Error("You have already joined this game");
        } else {
            const cards = cardsManager.assign(this.players, 5);
            const player = { username, cards, score: 0, finishedTurn: false };
            this.players.push(player);
            socket.emitPlayers(this.roomId, this.getPlayers());
        }
    }

    /* Remove player from current game */
    quitGame(username) {    
        if (this.status === statusTypes.NOT_STARTED && this.players.some(player => player.username === username)) {
            this.players = this.players.filter((otherPlayer) => otherPlayer.username !== username);
            socket.emitPlayers(this.roomId, this.getPlayers());
        } else {
            throw Error("Cannot log out of a running game.");
        }
    }

    /* Start the game with the players that have joined */
    startGame() {
        if (this.status !== statusTypes.NOT_STARTED) {
            throw Error("Game has already started");
        } else if (this.players.length < minPlayers) {
            throw Error("Insufficient number of players");
        } else {
            socket.emitStartGame(this.roomId);
            this.nextRound();
        }
    }

    /* End the game */
    endGame() {
        if (this.status === statusTypes.GAME_OVER) {
            socket.emitEndGame(this.roomId);
            this.clearGameState();
        } else {
            throw Error("Cannot end game. Game is currently running");
        } 
    }

    /* Move on to the next round, called when all players have finished their turn */
    nextRound() {
        clearTimeout(this.nextRoundTimeout);
        if (this.roundNum < this.rounds) {
            this.clearRoundData();
            this.clearFinishedTurn();
            this.setStatus(statusTypes.WAITING_FOR_CURRENT_PLAYER);
            this.roundNum++;
            this.currentPlayer = this.players[this.roundNum % this.players.length];
            socket.emitNewRound(this.roomId, this.status, this.roundNum, this.currentPlayer);
            socket.promptCurrentPlayer(this.roomId, this.currentPlayer, promptDuration);
            this.nextRoundTimeout = setTimeout(this.nextRound.bind(this), promptDuration);
        } else {
            this.setStatus(statusTypes.GAME_OVER);
            const winner = this.players.reduce((prev, current) => (prev.score > current.score) ? prev : current);
            socket.emitWinner(this.roomId, { username: winner.username });
        }
    }

    /* Clean up stored data */
    clearRoundData() {
        this.currentWord = '';
        this.playedCards = [];
        this.votes = [];
    }

    /* Clears the bool for finished turn */
    clearFinishedTurn() {
        this.players.forEach(player => player.finishedTurn = false);
        socket.emitPlayers(this.roomId, this.getPlayers());
    }

    /* The storyteller plays a card and a word */
    playCardAndWord(username, cardId, word) {
        if (this.status !== statusTypes.WAITING_FOR_CURRENT_PLAYER) {
            throw Error("Now is not the right time to play a card and a word");
        } else if (this.hasPlayedCard(username)) {
            throw Error("You cannot play more than one card and one word");
        } else {
            clearTimeout(this.nextRoundTimeout);
            this.getCardsByUsername(username).find(playedCard => playedCard.cardId === cardId).played = true;
            const card = { username, cardId };
            this.playedCards.push(card);
            socket.emitPlayedCards(this.roomId, this.getHiddenPlayedCards());
            this.setStatus(statusTypes.WAITING_FOR_OTHER_PLAYERS);
            this.currentWord = word;
            socket.emitWord(this.roomId, this.currentWord);
            this.markTurnAsFinished(username);
            socket.promptOtherPlayers(this.roomId, this.currentPlayer, promptDuration);
            this.playRandomCardsTimeout = setTimeout(this.playRandomCards.bind(this), promptDuration);
        }
    }

    /* Mark the player's turn as finished and notify the other players */
    markTurnAsFinished(username) {
        this.players.find(player => player.username === username).finishedTurn = true;
        socket.emitPlayers(this.roomId, this.getPlayers());
    }

    /* Random card pushed if player does not submit in time*/
    playRandomCards() {
        this.players.forEach(player => {
            if(!this.hasPlayedCard(player.username)) {
                const cards = this.getCardsByUsername(player.username);
                const randomCard = cards[Math.floor(Math.random()*cards.length)];
                this.playCard(player.username, randomCard.cardId); 
            }
        });
    }

    /* Draws a new card for the player's hand */
    newCard() {
        this.players.forEach(player => {
            const newCard = cardsManager.assign(this.players, 1);
            player.cards.push(newCard[0]);
        });
    }

    /* Adds player's card to list of played cards */
    playCard(username, cardId) {
        if (this.status !== statusTypes.WAITING_FOR_OTHER_PLAYERS) {
            throw Error("Now is not the right time to play a card");
        } else if (this.hasPlayedCard(username)) {
            throw Error("You cannot play more than one card");
        } else {
            const card = { username, cardId };
            this.playedCards.push(card);
            socket.emitPlayedCards(this.roomId, this.getHiddenPlayedCards());
            socket.emitPlayedCard(username, card);
            this.getCardsByUsername(username).find(playedCard => playedCard.cardId === cardId).played = true;
            this.markTurnAsFinished(username);
            if (this.allPlayersPlayedCard()) {
                clearTimeout(this.playRandomCardsTimeout);
                this.clearFinishedTurn();
                this.emitPlayedCards();
            }
        }
    }

    /* Emit the played cards for voting */
    emitPlayedCards() {
        socket.emitPlayedCards(this.roomId, this.getPlayedCards());
        this.setStatus(statusTypes.WAITING_FOR_VOTES);
        socket.promptPlayersVote(this.roomId, this.currentPlayer, promptDuration);
        this.voteTimeout = setTimeout(this.emitVotes.bind(this), promptDuration);
    };

    /* Vote for a card */
    voteCard(username, cardId) {
        if (this.status !== statusTypes.WAITING_FOR_VOTES) {
            throw Error("Now is not the right time to vote");
        } else if (this.hasVoted(username)) {
            throw Error("You cannot vote for a card more than once");
        } else {
            const vote = { username, cardId };
            this.votes.push(vote);
            this.markTurnAsFinished(username);
            if (this.allPlayersVoted()) {
                clearTimeout(this.voteTimeout);
                this.emitVotes();
            }
        }
    }

    /* Emit the votes to the players */
    emitVotes() {
        this.newCard();
        this.setStatus(statusTypes.DISPLAY_ALL_VOTES);
        socket.emitAllVotes(this.roomId, this.votes);
        this.calcScores();
        this.nextRoundTimeout = setTimeout(this.nextRound.bind(this), nextRoundDuration);
    };

    /* Calculate the scores for this round */
    calcScores () {
        const correctCard = this.playedCards.find(card => card.userId === this.currentPlayer.userId);
        const correctVotes = this.votes.filter(vote => vote.cardId === correctCard.cardId);
        if ((correctVotes.length % this.votes.length) === 0) {
            this.players.forEach(player => {if (player !== this.currentPlayer) player.score += 2});
        } else {
            this.currentPlayer.score += 3;
            correctVotes.forEach(vote => this.players.find(player => player.username === vote.username).score += 3);
            this.votes.filter(vote => vote.cardId !== correctCard.cardId).forEach(vote => {
                const votedCard = this.playedCards.find(card => card.cardId === vote.cardId);
                this.players.find(player => player.username === votedCard.username).score += 1;
            });
        }
        socket.emitPlayers(this.roomId, this.getPlayers());
    }

    /* Clear entire game state */
    clearGameState() {
        this.clearAllTimeouts();
        this.clearRoundData();
        this.status = statusTypes.NOT_STARTED;
        this.currentPlayer = null;
        this.roundNum = 0;
        this.players = [];
    }

    /* Clear timeouts */
    clearAllTimeouts() {
        clearTimeout(this.playRandomCardsTimeout);
        clearTimeout(this.voteTimeout);
        clearTimeout(this.nextRoundTimeout);
    }
}
exports.GameLogic = GameLogic;
