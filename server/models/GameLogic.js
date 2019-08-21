const cardsManager = require('../services/cardsManager');
const socket = require('../services/socket');
const { statusTypes } = require('./statusTypes');
const AI = require('../services/AI/AI');

// Set durations
const promptDuration = process.env.NODE_ENV === 'testing' ? 4000 : 30000;
const voteDuration = process.env.NODE_ENV === 'testing' ? 5000 : 30000;
const storytellerDuration = process.env.NODE_ENV === 'testing' ? 4000 : 60000;
const nextRoundDuration = process.env.NODE_ENV === 'testing' ? 3000 : 10000;
const minPlayers = process.env.NODE_ENV === 'testing' ? 1 : 3;
const maxPlayers = 6;
exports.minPlayers = minPlayers;
exports.maxPlayers = maxPlayers;

class GameLogic {
    constructor(roomId, numRounds) {
        this.roomId = roomId;
        this.rounds = numRounds;
        this.status = statusTypes.NOT_STARTED;
        this.roundNum = 0;
        this.currentPlayer = null;
        this.currentWord = '';
        /** @type {{ username: string, id: number, cards: {{ cardId: number, played: bool }[]}, score: number, real: bool }[]} */
        this.players = [];
        /** @type {{ username: string, cardId: number }[]} */
        this.playedCards = [];
        /** @type {{ username: string, cardId: number }[]} */
        this.votes = [];

        // Initialise timers
        this.playRandomCardsTimeout = null;
        this.displayCardsTimeout = null;
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
        if (this.status === statusTypes.GAME_OVER) {
            throw Error('This game has ended');
        } else if (this.status === statusTypes.NOT_STARTED) {
            throw Error('This game has not started');
        } else return {
            playedCards: this.getPlayedCards(),
            playCard: (!this.hasPlayedCard(username) && this.currentPlayer.username === username && this.status === statusTypes.WAITING_FOR_CURRENT_PLAYER)
                    || (!this.hasPlayedCard(username) && this.status === statusTypes.WAITING_FOR_OTHER_PLAYERS),
            playWord: this.currentPlayer.username === username && !this.currentWord && this.status === statusTypes.WAITING_FOR_CURRENT_PLAYER,
            voteCard: !this.hasVoted(username) && this.currentPlayer.username !== username && this.status === statusTypes.WAITING_FOR_VOTES,
            currentPlayer: { username: this.currentPlayer.username }
        }
    }

    /* Returns true if this is the current player */
    isCurrentPlayer(username) { return this.currentPlayer.username === username };

    /* Get the list of cards for a specific player */
    getCardsByUsername(username) { return this.players.find(player => player.username === username).cards };

    /* Get the list of unplayed cards for a specific player */
    getUnplayedCardsByUsername(username) { return this.players.find(player => player.username === username).cards.filter(card => !card.played) };

    /* Return the list of players, hiding their assigned cards */
    getPlayers() { return this.players.map(player => ({ username: player.username, id: player.id, score: player.score, finishedTurn: player.finishedTurn, real: player.real })) };

    getNumberOfAIPlayers() { return this.players.filter(player => !player.real).length };
    
    /* Return the list of cards played this round, hiding who played them */
    getPlayedCards() {
        if (this.status === statusTypes.WAITING_FOR_VOTES) {
            return this.playedCards.map(card => ({ cardId: card.cardId }));
        } else if (this.status === statusTypes.DISPLAY_ALL_VOTES) {
            return this.playedCards.map(card => ({...card, votes: this.votes.filter(vote => vote.cardId === card.cardId)}));
        } else {
            return this.playedCards.map(() => ({}));
        }
    };

    /* Return true if the player has already played this round */
    hasPlayedCard(username) { return this.playedCards.some(card => card.username === username) };

    /* Return true if the player has already voted this round */
    hasVoted(username) { return this.votes.some(vote => vote.username === username) };

    /* Returns true if all players have played a card this round */
    allPlayersPlayedCard () { return this.players.every(player => this.hasPlayedCard(player.username)) };

    /* Returns true if all players (apart from the current player) have voted this round */
    allPlayersVoted() { return this.players.every(player => player.username === this.currentPlayer.username || this.hasVoted(player.username)) };

    /* Add the player to the game if possible */
    joinGame(user) {
        if (this.status !== statusTypes.NOT_STARTED) {
            throw Error("Game has already started");
        } else if (this.players.some(player => player.username === user.username)) {
            throw Error("You have already joined this game");
        } else if (this.players.length === maxPlayers) {
            throw Error("The room has reached its capacity");
        } else {
            const cards = cardsManager.assign(this.players, 6);
            const player = { username: user.username, id: user.id, cards, score: 0, real: user.real, finishedTurn: false };
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
            socket.emitNewRound(this.roomId, this.status, this.roundNum, this.rounds, this.currentPlayer, storytellerDuration);
            this.nextRoundTimeout = setTimeout(this.nextRound.bind(this), storytellerDuration);
            if (!this.currentPlayer.real) {
                this.AIsPlayCardAndWord();
            }
        } else {
            this.setStatus(statusTypes.GAME_OVER);
            const winner = this.players.reduce((prev, current) => (prev.score > current.score) ? prev : current);
            const drawers = this.calculateDrawers(winner.score);
            if (drawers.length > 1) {
                socket.emitDrawers(this.roomId, drawers);
            } else {
                socket.emitWinner(this.roomId, { username: winner.username });
            }
        }
    }

    /*AIs play card and word*/
    AIsPlayCardAndWord() {
        const cards = this.getUnplayedCardsByUsername(this.currentPlayer.username);
        const cardId = AI.pickRandomCard(cards);
        AI.autoWord(cardId).then((word) => {
            this.playCardAndWord(this.currentPlayer.username, cardId, word);
        }).catch( error => {
            console.error(error);
        });
    }

    calculateDrawers(topscore) {
        return this.players.reduce((accumulator, current) => {
            if (current.score === topscore) {
                return [...accumulator, current];
            }
            return accumulator;
        },
        []);
    };

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
        } else if (username !== this.currentPlayer.username) {
            throw Error("You cannot play a word and a card when it is not your turn.");
        } else if (word.trim().length <= 0) {
            throw Error("Word cannot be empty.");
        } else if (word.trim().length > 25) {
            throw Error("Word cannot be longer than 25 characters.");
        } else {
            clearTimeout(this.nextRoundTimeout);
            this.getCardsByUsername(username).find(playedCard => playedCard.cardId === cardId).played = true;
            const card = { username, cardId };
            this.playedCards.push(card);
            socket.emitPlayedCards(this.roomId, this.getPlayedCards());
            this.setStatus(statusTypes.WAITING_FOR_OTHER_PLAYERS);
            this.currentWord = word;
            socket.emitWord(this.roomId, this.currentWord);
            this.markTurnAsFinished(username);
            socket.promptOtherPlayers(this.roomId, this.currentPlayer, promptDuration);
            this.AIsPlayCard();
            this.playRandomCardsTimeout = setTimeout(this.playRandomCards.bind(this), promptDuration);
        }
    }

    /* AIs play a card */
    AIsPlayCard() {
        this.players.forEach(player => {
            if (!player.real && !this.isCurrentPlayer(player.username)) {
                const cards = this.getUnplayedCardsByUsername(player.username);
                const cardId = AI.pickRandomCard(cards);
                this.playCard(player.username, cardId);
            }
        });
    }

    /* Mark the player's turn as finished and notify the other players */
    markTurnAsFinished(username) {
        this.players.find(player => player.username === username).finishedTurn = true;
        socket.emitPlayers(this.roomId, this.getPlayers());
    }

    /* Random card pushed if player does not submit in time*/
    playRandomCards() {
        this.players.forEach(player => {
            if (!this.hasPlayedCard(player.username)) {
                const cards = this.getUnplayedCardsByUsername(player.username);
                const cardId = AI.pickRandomCard(cards);
                this.playCard(player.username, cardId); 
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
            socket.emitPlayedCards(this.roomId, this.getPlayedCards());
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

    /* Shuffle the cards */
    shufflePlayedCards() {
        this.playedCards = cardsManager.shuffle(this.playedCards);
    }

    /* Emit the played cards for voting */
    emitPlayedCards() {
        this.setStatus(statusTypes.WAITING_FOR_VOTES);
        this.shufflePlayedCards();
        socket.emitPlayedCards(this.roomId, this.getPlayedCards());
        socket.promptPlayersVote(this.roomId, this.currentPlayer, voteDuration);
        this.AIsVote();
        this.voteTimeout = setTimeout(this.emitVotes.bind(this), voteDuration);
    };

    /* AI votes for a card */
    AIsVote() {
        this.players.forEach(player => {
            if (!player.real && !this.isCurrentPlayer(player.username)) {
                const cards = this.getPlayedCards();
                const cardId = AI.pickRandomCard(cards);
                this.voteCard(player.username, cardId);
            }
        });
    }

    /* Vote for a card */
    voteCard(username, cardId) {
        if (this.status !== statusTypes.WAITING_FOR_VOTES) {
            throw Error("Now is not the right time to vote");
        } else if (this.hasVoted(username)) {
            throw Error("You cannot vote for a card more than once");
        } else if (username === this.currentPlayer.username) {
            throw Error("You cannot vote for a card when it is your turn.");
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
    emitVotes(word) {
        this.newCard();
        this.setStatus(statusTypes.DISPLAY_ALL_VOTES);
        socket.emitPlayedCards(this.roomId, this.getPlayedCards());
        this.calcScores();
        this.updateLabels(this.currentWord);
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

    updateLabels(word) {
        this.playedCards.forEach(card => {
            const cardScore = this.votes.filter(vote => card.cardId === vote.cardId).length
            if (cardScore >= 1) {
                AI.newWords(card.cardId, word)
            }
        });
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
        clearTimeout(this.displayCardsTimeout);
    }
}
exports.GameLogic = GameLogic;
