const cardManager = require('../services/cards');
const socket = require('../services/socket');
const { statusTypes } = require('./statusTypes');

// Set durations
const promptDuration = process.env.NODE_ENV === 'testing' ? 2000 : 37000;
const nextRoundDuration = process.env.NODE_ENV === 'testing' ? 2000 : 5000;
const rounds = 3;
const minPlayers = process.env.NODE_ENV === 'testing' ? 2 : 2;
exports.minPlayers = minPlayers;

class GameLogic {
    constructor(roomId) {
        this.roomId = roomId;
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
        this.playCardTimeout = null;
        this.voteTimeout = null;
        this.nextRoundTimeout = null;
    }
  
    /* Get current state of the game (needed for a player after refresh of page) */
    getState(username) {
        return {
            status: this.status,
            voteCard: !this.playerHasVoted(username) && this.currentPlayer.username !== username && this.status === statusTypes.WAITING_FOR_VOTES ,
            playCard: (!this.playerHasPlayedCard(username) && this.currentPlayer.username === username && this.status === statusTypes.WAITING_FOR_CURRENT_PLAYER)
                    || (!this.playerHasPlayedCard(username) && this.status === statusTypes.WAITING_FOR_OTHER_PLAYERS),
            playWord: this.currentPlayer.username === username && !this.currentWord && this.status === statusTypes.WAITING_FOR_CURRENT_PLAYER
        }
    }

    /* Set the status of the game */
    setStatus(status) { this.status = status };

    /* Get the list of cards for a specific player */
    getCardsByUsername(username) { return this.players.find(player => player.username === username).cards };

    /* Returns true if this is the current player */
    isCurrentPlayer(username) { return this.currentPlayer.username === username };

    /* Get the list of unplayed cards for a specific player */
    getUnplayedCardsByUsername(username) { return this.players.find(player => player.username === username).cards.filter(card => !card.played) };

    /* Return the list of players, hiding their assigned cards */
    getPlayers() { return this.players.map(player => ({ username: player.username, score: player.score })) };

    /* Return the list of cards played this round, hiding who played them */
    getPlayedCards() { return this.playedCards.map(card => ({ cardId: card.cardId })).sort(() => .5 - Math.random()) };

    /* Add the player to the game if possible */
    joinGame(username) {
        if (this.status !== statusTypes.NOT_STARTED) {
            throw Error("Game has already started");
        } else if (this.players.some(player => player.username === username)) {
            throw Error("You have already joined this game");
        } else {
            const cards = cardManager.assign(this.players, rounds);
            const player = { username, cards, score: 0 };
            this.players.push(player);      
            socket.emitPlayers(this.roomId, this.players);
        }
    }

    /* Remove player from current game */
    quitGame(username) {    
        if (this.status === statusTypes.NOT_STARTED && this.players.some(player => player.username === username)) {
            this.players = this.players.filter((otherPlayer) => otherPlayer.username !== username);
            socket.emitPlayers(this.roomId, this.players);
        } else {
            // Game has started, player can't quit, server is responsible for generating the error
            throw Error("Cannot log out of a running game.");
        }
    }

    /* Start the game with the players that have joined */
    startGame() {        
        if (this.status === statusTypes.NOT_STARTED && this.players.length >= minPlayers) {
            this.setStatus(statusTypes.STARTED);
            this.nextRound();
            socket.emitPlayers(this.roomId, this.players);
            socket.emitStartGame(this.roomId);
        } else {
            // There aren't yet enough players in the game, server is responsible for generating the error
            throw Error("Cannot start game. Insufficient number of players");
        }
    }

    /* End the game */
    endGame() {
        if (this.status === statusTypes.GAME_OVER) {
            socket.emitEndGame(this.roomId);
            this.clearGameState();
        } else {
            // Game is currently running and cannot be ended, server is responsible for generating the error
            throw Error("Cannot end game. Game is currently running");
        } 
    }

    /* Move on to the next round, called when all players have finished their turn */
    nextRound() {
        if (this.roundNum < rounds) {
            this.clearRoundData();
            this.setStatus(statusTypes.WAITING_FOR_CURRENT_PLAYER);
            this.roundNum++;
            this.currentPlayer = this.players[this.roundNum % this.players.length];
            this.clearFinishedTurn();
            socket.emitNewRound(this.roomId, this.status, this.roundNum, this.currentPlayer);
            socket.promptCurrentPlayer(this.roomId, this.currentPlayer);
        } else {
            this.setStatus(statusTypes.GAME_OVER);
            socket.emitStatus(this.roomId, this.status);
            const winner = this.players.reduce((prev, current) => (prev.score > current.score) ? prev : current);
            socket.emitWinner(this.roomId, { username: winner.username });
        }
    }

    /* The storyteller plays a card and a word */
    playCardAndWord(username, cardId, word) {
        if (this.status !== statusTypes.WAITING_FOR_CURRENT_PLAYER) {
            throw Error("Now is not the right time to play a card and a word");
        } else if (this.playerHasPlayedCard(username)) {
            throw Error("You cannot play more than one card and one word");
        } else {
            const card = { username, cardId };
            this.playedCards.push(card);
            this.getCardsByUsername(username).find(playedCard => playedCard.cardId === cardId).played = true;
            this.setStatus(statusTypes.WAITING_FOR_OTHER_PLAYERS);
            socket.emitStatus(this.roomId, this.status);
            this.currentWord = word;
            socket.emitWord(this.roomId, this.currentWord);
            this.markTurnAsFinished(username);
            socket.promptOtherPlayers(this.roomId, this.currentPlayer, promptDuration);
            this.playCardTimeout = setTimeout(this.playRandomCard.bind(this), promptDuration);
        }
    }

    /* Random card pushed if player does not submit in time*/
    playRandomCard() {
        this.players.forEach(player => {
            if(!this.isCurrentPlayer(player.username) && !this.playerHasPlayedCard(player.username)) {
                const cards = this.getCardsByUsername(player.username);
                const randomCard = (cards[Math.floor(Math.random()*cards.length)]);
                this.playCard(player.username, randomCard.cardId); 
            }
        });
    }

    /* Adds player's card to list of played cards */
    playCard(username, cardId) {
        if (this.status !== statusTypes.WAITING_FOR_OTHER_PLAYERS) {
            throw Error("Now is not the right time to play a card");
        } else if (this.playerHasPlayedCard(username)) {
            throw Error("You cannot play more than one card");
        } else {
            const card = { username, cardId };
            this.playedCards.push(card);
            this.getCardsByUsername(username).find(playedCard => playedCard.cardId === cardId).played = true;
            this.markTurnAsFinished(username);
            if (this.allPlayersPlayedCard()) {
                clearTimeout(this.playCardTimeout);
                this.clearFinishedTurn();
                this.emitPlayedCards();
            }
        }
    }

    /* Emit the played cards for voting */
    emitPlayedCards() {
        this.setStatus(statusTypes.WAITING_FOR_VOTES);
        socket.emitPlayedCards(this.roomId, this.getPlayedCards());
        socket.promptPlayersVote(this.roomId, this.currentPlayer, promptDuration);
        this.voteTimeout = setTimeout(this.emitVotes.bind(this), promptDuration);
    };

    /* Vote for a card */
    voteCard(username, cardId) {
        if (this.status !== statusTypes.WAITING_FOR_VOTES) {
            throw Error("Now is not the right time to vote");
        } else if (this.playerHasVoted(username)) {
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

    emitVotes() {
        this.setStatus(statusTypes.DISPLAY_ALL_VOTES);
        socket.emitStatus(this.roomId, this.status);
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
        socket.emitPlayers(this.roomId, this.players);
    }

    /* Return true if the player has already played this round */
    playerHasPlayedCard(username) { return this.playedCards.some(card => card.username === username) };

    /* Return true if the player has already voted this round */
    playerHasVoted(username) { return this.votes.some(vote => vote.username === username) };

    /* Returns true if all players have played a card this round */
    allPlayersPlayedCard () { return this.players.every(player => this.playerHasPlayedCard(player.username)) };

    /* Returns true if all players (apart from the current player) have voted this round */
    allPlayersVoted() { return this.players.every(player => player.username === this.currentPlayer.username || this.playerHasVoted(player.username)) };

    /* Mark the player's turn as finished and notify the other players */
    markTurnAsFinished(username) {
        this.players.find(player => player.username === username).finishedTurn = true;
        socket.emitPlayers(this.roomId, this.players);
    }

    /* Clean up stored data */
    clearRoundData() {
        this.currentWord = '';
        this.playedCards = [];
        this.votes = [];
    }

    /* Clear entire game state */
    clearGameState() {
        this.clearTimeouts();
        this.clearRoundData();
        this.setStatus(statusTypes.NOT_STARTED);
        this.currentPlayer = null;
        this.roundNum = 0;
        this.players = [];
    }

    /* Clear timeouts */
    clearTimeouts() {
        clearTimeout(this.playCardTimeout);
        clearTimeout(this.voteTimeout);
        clearTimeout(this.nextRoundTimeout);
    }

    /* Clears the bool for finished turn */
    clearFinishedTurn() {
        this.players.forEach(player => player.finishedTurn = false);
        socket.emitPlayers(this.roomId, this.players);
    }
}
exports.GameLogic = GameLogic;
