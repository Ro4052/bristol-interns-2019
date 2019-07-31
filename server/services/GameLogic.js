const cardManager = require('./cards');
const socket = require('./socket');
const { statusTypes } = require('./statusTypes');

// Set durations
const promptDuration = process.env.NODE_ENV === 'testing' ? 2000 : 37000;
const nextRoundDuration = process.env.NODE_ENV === 'testing' ? 2000 : 5000;
const rounds = 3;
const minPlayers = process.env.NODE_ENV === 'testing' ? 2 : 3;
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
            playedCards: (this.status === statusTypes.WAITING_FOR_VOTES || this.status === statusTypes.DISPLAY_ALL_VOTES) ? this.getPlayedCards() : this.getHiddenPlayedCards(),
            playCard: (!this.playerHasPlayedCard(username) && this.currentPlayer.username === username && this.status === statusTypes.WAITING_FOR_CURRENT_PLAYER)
                    || (!this.playerHasPlayedCard(username) && this.status === statusTypes.WAITING_FOR_OTHER_PLAYERS),
            playWord: this.currentPlayer.username === username && !this.currentWord && this.status === statusTypes.WAITING_FOR_CURRENT_PLAYER,
            voteCard: !this.playerHasVoted(username) && this.currentPlayer.username !== username && this.status === statusTypes.WAITING_FOR_VOTES
        }
    }

    /* Set the status of the game */
    setStatus(newStatus) { return this.status = newStatus };

    /* Get the list of cards for a specific player */
    getCardsByUsername(username) { return this.players.find(player => player.username === username).cards};

    /* Returns true if this is the current player */
    isCurrentPlayer(username) { return this.currentPlayer.username === username };

    /* Get the list of unplayed cards for a specific player */
    getUnplayedCardsByUsername(username) { return this.players.find(player => player.username === username).cards.filter(card => !card.played) };

    /* Return the list of players, hiding their assigned cards */
    getPlayers() { return this.players.map(player => ({ username: player.username, score: player.score, finishedTurn: player.finishedTurn })) };

    /**
     * Shuffles cards in place.
     * @param {Array} cards
    */
    shuffle(cards) {
        for (let i = cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const x = cards[i];
            cards[i] = cards[j];
            cards[j] = x;
        }
        return cards;
    }

    /* Return the list of cards played this round, hiding who played them */
    getPlayedCards() { return this.shuffle(this.playedCards.map(card => ({ cardId: card.cardId }))) };

    /* Return an empty list of cards with size equal to the number of played cards */
    getHiddenPlayedCards() { return this.playedCards.map(card => {}) };

    /* Add the player to the game if possible */
    joinGame(username) {
        if (this.status !== statusTypes.NOT_STARTED) {
            throw Error("Game has already started");
        } else if (this.players.some(player => player.username === username)) {
            throw Error("You have already joined this game");
        } else {
            const cards = cardManager.assign(this.players, rounds);
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
            // Game has started, player can't quit, server is responsible for generating the error
            throw Error("Cannot log out of a running game.");
        }
    }

    /* Start the game with the players that have joined */
    startGame() {        
        if (this.status === statusTypes.NOT_STARTED && this.players.length >= minPlayers) {
            this.setStatus(statusTypes.STARTED);
            this.nextRound();
            socket.emitPlayers(this.roomId, this.getPlayers());
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
        this.clearTimeouts();
        if (this.roundNum < rounds) {
            this.clearRoundData();
            this.setStatus(statusTypes.WAITING_FOR_CURRENT_PLAYER);
            this.roundNum++;
            this.currentPlayer = this.players[this.roundNum % this.players.length];
            this.clearRoundData();
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
        if (this.status === statusTypes.WAITING_FOR_CURRENT_PLAYER && !this.playerHasPlayedCard(username)) {
            const card = { username, cardId };
            this.playedCards.push(card);
            socket.emitPlayedCards(this.roomId, this.getHiddenPlayedCards());
            this.getCardsByUsername(username).find(playedCard => playedCard.cardId === cardId).played = true;
            this.setStatus(statusTypes.WAITING_FOR_OTHER_PLAYERS);
            socket.emitStatus(this.roomId, this.status);
            this.currentWord = word;
            socket.emitWord(this.roomId, this.currentWord);
            this.markTurnAsFinished(username);
            socket.promptOtherPlayers(this.roomId, this.currentPlayer, promptDuration);
            this.playCardTimeout = setTimeout(() => this.playRandomCard(), promptDuration);
        } else {
            // Cannot play card and word, the user sending the request is not the current player, the player has already played a card,
            // or the game status is not appropriate for the request, server is responsible for generating an error
            throw Error("You cannot play more than one card and one word, or now is not the right time to play a card and a word.");
        }
    }

    /* Random card pushed if player does not submit in time*/
    playRandomCard() {
        this.players.forEach(player => {
            if(!this.isCurrentPlayer(player.username) && !this.playerHasPlayedCard(player.username)) {
                const cards = this.getCardsByUsername(player.username);
                const randomCard = (cards[Math.floor(Math.random()*cards.length)]);
                this.playedCards.push(randomCard);
                socket.emitPlayedCards(this.roomId, this.getHiddenPlayedCards());
                player.finishedTurn = true;
                socket.emitPlayers(this.roomId, this.getPlayers());
                cards.find(card => card.cardId === randomCard.cardId).played = true;
                socket.emitPlayedCard(player.username, randomCard);
            }
        });
        this.emitPlayedCards();
    }
    
    /* Draws a new card for the player's hand */
    newCard() {
        this.players.forEach(player => {
            const newCard = cardManager.assign(this.players, 1);
            player.cards.push(newCard[0]);
        });
    }  
     
    /* Adds player's card to list of played cards */
    playCard(username, cardId) {      
        if (this.status === statusTypes.WAITING_FOR_OTHER_PLAYERS && !this.playerHasPlayedCard(username)) {
            const card = { username, cardId };
            this.playedCards.push(card);
            socket.emitPlayedCards(this.roomId, this.getHiddenPlayedCards());
            this.getCardsByUsername(username).find(playedCard => playedCard.cardId === cardId).played = true;
            this.markTurnAsFinished(username);
            if (this.allPlayersPlayedCard()) {
                this.clearTimeouts();
                this.clearFinishedTurn();
                this.setStatus(statusTypes.WAITING_FOR_VOTES);
                socket.emitPlayedCards(this.roomId, this.getPlayedCards());
                socket.emitStatus(this.roomId, this.status);
                socket.promptPlayersVote(this.roomId, this.currentPlayer, promptDuration);
                this.voteTimeout = setTimeout(() => this.emitVotes(), promptDuration);
            }
        } else {
            // Cannot play card, the player has already played a card, or the game status is not
            // appropriate for the request, server is responsible for generating an error.
            throw Error("You cannot play more than one card, or now is not the right time to play a card.");
        }
    }

    /* Vote for a card */
    voteCard(username, cardId) {
        if (this.status === statusTypes.WAITING_FOR_VOTES && !this.playerHasVoted(username)) {
            const vote = { username, cardId };
            this.votes.push(vote);
            this.markTurnAsFinished(username);
            if (this.allPlayersVoted()) {
                this.clearTimeouts();
                this.setStatus(statusTypes.DISPLAY_ALL_VOTES);
                socket.emitStatus(this.roomId, this.status);
                socket.emitAllVotes(this.roomId, this.votes);
                this.calcScores();
                this.newCard();
                this.nextRoundTimeout = setTimeout(() => this.nextRound(), nextRoundDuration);
            }
        } else {
            // Cannot vote for card, the player has already voted for a card, or the game status is not
            // appropriate for the request, server is responsible for generating an error.
            throw Error("You cannot vote for a card more than once, or now is not the right time to vote.");
        }
    }
    
    emitVotes() {
        this.clearTimeouts();
        this.status = statusTypes.DISPLAY_ALL_VOTES;
        socket.emitStatus(this.roomId, this.status);
        socket.emitAllVotes(this.roomId, this.votes);
        this.calcScores();
        this.nextRoundTimeout = setTimeout(() => this.nextRound(), nextRoundDuration);
    };

    emitPlayedCards() {
        this.clearTimeouts();
        this.status = statusTypes.WAITING_FOR_VOTES;
        socket.emitPlayedCards(this.roomId, this.getPlayedCards());
        socket.promptPlayersVote(this.roomId, this.currentPlayer, promptDuration);
        this.voteTimeout = setTimeout(() => this.emitVotes(), promptDuration);
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
        socket.emitPlayers(this.roomId, this.getPlayers());
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
        socket.emitPlayers(this.roomId, this.getPlayers());
    }
}
exports.GameLogic = GameLogic;
