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
    constructor(notifyObserver, roomId, numRounds, gameMode, allCardsNumber) {
        this.notifyObserver = notifyObserver;
        this.state = {
            status: statusTypes.NOT_STARTED,
            roundNum: 0,
            mode: gameMode,
            allCardsNumber: allCardsNumber,
            currentPlayer: null,
            currentWord: '',
            /** @type {{ username: string, id: number, cards: {{ cardId: number, played: bool }[]}, score: number, real: bool }[]} */
            players: [],
            /** @type {{ username: string, cardId: number }[]} */
            playedCards: [],
            /** @type {{ username: string, cardId: number }[]} */
            votes: [],
            winners: []
        };
        this.roomId = roomId;
        this.rounds = numRounds;
        // Initialise timers
        this.playRandomCardsTimeout = null;
        this.displayCardsTimeout = null;
        this.voteTimeout = null;
        this.nextRoundTimeout = null;
    }

    /* Update the game state */
    update(data = {}) {
        this.state = { ...this.state, ...data };
        socket.emitStatus(this.roomId, this.state.status);
        socket.emitPlayers(this.roomId, this.getPlayers());
        socket.emitPlayedCards(this.roomId, this.getPlayedCards());
        socket.emitWord(this.roomId, this.state.currentWord);
        socket.emitWinners(this.roomId, this.state.winners);
        this.notifyObserver(this.state);
    }

    /* Get current state of the game */
    getState(username) {
        if (this.state.status === statusTypes.GAME_OVER) {
            throw Error('This game has ended');
        } else if (this.state.status === statusTypes.NOT_STARTED) {
            throw Error('This game has not started');
        } else return {
            playedCards: this.getPlayedCards(),
            playCard: (!this.hasPlayedCard(username) && this.state.currentPlayer.username === username && this.state.status === statusTypes.WAITING_FOR_CURRENT_PLAYER)
                    || (!this.hasPlayedCard(username) && this.state.status === statusTypes.WAITING_FOR_OTHER_PLAYERS),
            playWord: this.state.currentPlayer.username === username && !this.state.currentWord && this.state.status === statusTypes.WAITING_FOR_CURRENT_PLAYER,
            voteCard: !this.hasVoted(username) && this.state.currentPlayer.username !== username && this.state.status === statusTypes.WAITING_FOR_VOTES,
            currentPlayer: { username: this.state.currentPlayer.username }
        }
    }

    isStarted() { return this.state.status !== statusTypes.NOT_STARTED };

    hasMinPlayers() { return this.state.players.length < minPlayers };

    /* Returns true if this is the current player */
    isCurrentPlayer(username) { return this.state.currentPlayer.username === username };

    /* Get the list of cards for a specific player */
    getCardsByUsername(username) { return this.state.players.find(player => player.username === username).cards };

    /* Get the list of unplayed cards for a specific player */
    getUnplayedCardsByUsername(username) { return this.state.players.find(player => player.username === username).cards.filter(card => !card.played) };

    /* Return the list of players, hiding their assigned cards */
    getPlayers() { return this.state.players.map(player => ({ username: player.username, id: player.id, score: player.score, finishedTurn: player.finishedTurn, real: player.real })) };

    getNumberOfAIPlayers() { return this.state.players.filter(player => !player.real).length };
    
    /* Return the list of cards played this round, hiding who played them */
    getPlayedCards() {
        if (this.state.status === statusTypes.WAITING_FOR_VOTES) {
            return this.state.playedCards.map(card => ({ cardId: card.cardId, url: card.url }));
        } else if (this.state.status === statusTypes.DISPLAY_ALL_VOTES) {
            return this.state.playedCards.map(card => ({...card, votes: this.state.votes.filter(vote => vote.cardId === card.cardId)}));
        } else {
            return this.state.playedCards.map(() => ({}));
        }
    };

    /* Return true if the player has already played this round */
    hasPlayedCard(username) { return this.state.playedCards.some(card => card.username === username) };

    /* Return true if the player has already voted this round */
    hasVoted(username) { return this.state.votes.some(vote => vote.username === username) };

    /* Returns true if all players have played a card this round */
    allPlayersPlayedCard() { return this.state.players.every(player => this.hasPlayedCard(player.username)) };

    /* Returns true if all players (apart from the current player) have voted this round */
    allPlayersVoted() { return this.state.players.every(player => player.username === this.state.currentPlayer.username || this.hasVoted(player.username)) };

    /* Add the player to the game if possible */
    joinGame(user) {
        if (this.state.status !== statusTypes.NOT_STARTED) {
            throw Error("Game has already started");
        } else if (this.state.players.some(player => player.username === user.username)) {
            throw Error("You have already joined this game");
        } else if (this.state.players.length === maxPlayers) {
            throw Error("The room has reached its capacity");
        } else {
            const cards = cardsManager.assign(this.state.players, 6, this.state.allCardsNumber)
            const player = { username: user.username, id: user.id, cards, score: 0, real: user.real, finishedTurn: false };
            this.update({ players: [...this.state.players, player] });
        }
    }

    /* Remove player from current game */
    quitGame(username) {
        if (this.state.status === statusTypes.NOT_STARTED && this.state.players.some(player => player.username === username)) {
            this.update({ players: this.state.players.filter((otherPlayer) => otherPlayer.username !== username) });
        } else {
            throw Error("Cannot log out of a running game.");
        }
    }

    /* Start the game with the players that have joined */
    startGame() {
        if (this.isStarted()) {
            throw Error("Game has already started");
        } else if (this.hasMinPlayers()) {
            throw Error("Insufficient number of players");
        } else {
            socket.emitStartGame(this.roomId);
            this.nextRound();
        }
    }

    /* Move on to the next round, called when all players have finished their turn */
    nextRound() {
        clearTimeout(this.nextRoundTimeout);
        if (this.state.roundNum < this.rounds) {
            this.clearRoundData();
            this.clearFinishedTurn();
            this.update({ status: statusTypes.WAITING_FOR_CURRENT_PLAYER });
            this.state.roundNum++;
            this.state.currentPlayer = this.state.players[this.state.roundNum % this.state.players.length];
            socket.emitNewRound(this.roomId, this.state.status, this.state.roundNum, this.rounds, this.state.currentPlayer, storytellerDuration);
            this.nextRoundTimeout = setTimeout(this.nextRound.bind(this), storytellerDuration);
            if (!this.state.currentPlayer.real) {
                this.AIsPlayCardAndWord();
            }
        } else {
            const topScore = this.state.players.reduce((score, player) => player.score > score ? player.score : score, 0);
            this.update({
                status: statusTypes.GAME_OVER,
                winners: this.state.players.filter(player => player.score === topScore).map(winner => ({ username: winner.username }))
            });
        }
    }

    /*AIs play card and word*/
    AIsPlayCardAndWord() {
        const cards = this.getUnplayedCardsByUsername(this.state.currentPlayer.username);
        const cardId = AI.pickRandomCard(cards);
        AI.autoWord(cardId).then((word) => {
            this.playCardAndWord(this.state.currentPlayer.username, cardId, word);
        }).catch( error => {
            console.error(error);
        });
    }

    calculateDrawers(topscore) {
        return this.state.players.reduce((accumulator, current) => current.score === topscore ? [...accumulator, current] : accumulator, []);
    };

    /* Clean up stored data */
    clearRoundData() {
        this.state.currentWord = '';
        this.state.playedCards = [];
        this.state.votes = [];
    }

    /* Clears the bool for finished turn */
    clearFinishedTurn() {
        const players = this.state.players.map(player => ({ ...player, finishedTurn: false }));
        this.update({ players });
    }

    /* The storyteller plays a card and a word */
    playCardAndWord(username, cardId, word) {
        if (this.state.status !== statusTypes.WAITING_FOR_CURRENT_PLAYER) {
            throw Error("Now is not the right time to play a card and a word");
        } else if (this.hasPlayedCard(username)) {
            throw Error("You cannot play more than one card and one word");
        } else if (username !== this.state.currentPlayer.username) {
            throw Error("You cannot play a word and a card when it is not your turn.");
        } else if (word.trim().length <= 0) {
            throw Error("Word cannot be empty.");
        } else if (word.trim().length > 25) {
            throw Error("Word cannot be longer than 25 characters.");
        } else {
            clearTimeout(this.nextRoundTimeout);
            const playedCard = this.getCardsByUsername(username).find(playedCard => playedCard.cardId === cardId);
            playedCard.played = true;
            const card = { username, cardId, url: playedCard.url };
            this.update({
                status: statusTypes.WAITING_FOR_OTHER_PLAYERS,
                playedCards: [...this.state.playedCards, card],
                currentWord: word
            });
            this.markTurnAsFinished(username);
            socket.promptOtherPlayers(this.roomId, this.state.currentPlayer, promptDuration);
            this.AIsPlayCard();
            this.playRandomCardsTimeout = setTimeout(this.playRandomCards.bind(this), promptDuration);
        }
    }

    /* AIs play a card */
    AIsPlayCard() {
        this.state.players.forEach(player => {
            if (!player.real && !this.isCurrentPlayer(player.username)) {
                const cards = this.getUnplayedCardsByUsername(player.username);
                const cardId = AI.pickRandomCard(cards);
                this.playCard(player.username, cardId);
            }
        });
    }

    /* Mark the player's turn as finished and notify the other players */
    markTurnAsFinished(username) {
        this.state.players.find(player => player.username === username).finishedTurn = true;
        this.update();
    }

    /* Random card pushed if player does not submit in time*/
    playRandomCards() {
        this.state.players.forEach(player => {
            if (!this.hasPlayedCard(player.username)) {
                const cards = this.getUnplayedCardsByUsername(player.username);
                const cardId = AI.pickRandomCard(cards);
                this.playCard(player.username, cardId); 
            }
        });
    }

    /* Draws a new card for the player's hand */
    newCard() {
        this.state.players.forEach(player => {
            const newCard = cardsManager.assign(this.state.players, 1, this.state.allCardsNumber);
            player.cards.push(newCard[0]);
        });
    }

    /* Adds player's card to list of played cards */
    playCard(username, cardId) {
        if (this.state.status !== statusTypes.WAITING_FOR_OTHER_PLAYERS) {
            throw Error("Now is not the right time to play a card");
        } else if (this.hasPlayedCard(username)) {
            throw Error("You cannot play more than one card");
        } else {
            const url = this.getCardsByUsername(username).find(playedCard => playedCard.cardId === cardId).url;
            const card = { username, cardId, url };
            this.update({
                playedCards: [...this.state.playedCards, card]
            });
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
        this.update({
            status: statusTypes.WAITING_FOR_VOTES,
            playedCards: cardsManager.shuffle(this.state.playedCards)
        });
        socket.promptPlayersVote(this.roomId, this.state.currentPlayer, voteDuration);
        this.AIsVote();
        this.voteTimeout = setTimeout(this.emitVotes.bind(this), voteDuration);
    };

    /* AI votes for a card */
    AIsVote() {
        this.state.players.forEach(player => {
            if (!player.real && !this.isCurrentPlayer(player.username)) {
                const cards = this.getPlayedCards();
                const cardId = AI.pickRandomCard(cards);
                this.voteCard(player.username, cardId);
            }
        });
    }

    /* Vote for a card */
    voteCard(username, cardId) {
        if (this.state.status !== statusTypes.WAITING_FOR_VOTES) {
            throw Error("Now is not the right time to vote");
        } else if (this.hasVoted(username)) {
            throw Error("You cannot vote for a card more than once");
        } else if (username === this.state.currentPlayer.username) {
            throw Error("You cannot vote for a card when it is your turn.");
        } else {
            const vote = { username, cardId };
            this.state.votes.push(vote);
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
        this.update({ status: statusTypes.DISPLAY_ALL_VOTES });
        this.calcScores();
        this.updateLabels(this.currentWord);
        this.nextRoundTimeout = setTimeout(this.nextRound.bind(this), nextRoundDuration);
    };

    /* Calculate the scores for this round */
    calcScores () {
        const correctCard = this.state.playedCards.find(card => card.username === this.state.currentPlayer.username);
        const correctVotes = this.state.votes.filter(vote => vote.cardId === correctCard.cardId);
        if (!(correctVotes.length % this.state.votes.length)) {
            this.state.players.forEach(player => {
                if (player.username !== this.state.currentPlayer.username) player.score += 2
            });
        } else {
            this.state.currentPlayer.score += 3;
            correctVotes.forEach(vote => this.state.players.find(player => player.username === vote.username).score += 3);
            this.state.votes
            .filter(vote => vote.cardId !== correctCard.cardId)
            .forEach(vote => {
                const votedCard = this.state.playedCards.find(card => card.cardId === vote.cardId);
                this.state.players.find(player => player.username === votedCard.username).score += 1;
            });
        }
        this.update();
    }

    updateLabels(word) {
        this.state.playedCards.forEach(card => {
            const cardScore = this.state.votes.filter(vote => card.cardId === vote.cardId && this.state.players.find(player => player.username === vote.username).real).length;
            if (cardScore >= 2) {
                AI.addLabel(card.cardId, word);
            }
        });
    }

    /* Clear entire game state */
    clearGameState() {
        this.clearAllTimeouts();
        this.clearRoundData();
        this.state.status = statusTypes.NOT_STARTED;
        this.state.currentPlayer = null;
        this.state.roundNum = 0;
        this.state.players = [];
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
