const router = require('express').Router();
const path = require('path');
const auth = require('../middlewares/auth');
const Room = require('../models/room');
const { emitRooms, disconnectSocket, disconnectAllSockets, getAllSockets } = require('../services/socket');

const oauthClientId = process.env.CLIENT_ID;
const oauthSecret = process.env.CLIENT_SECRET;
const redirectURL = process.env.NODE_ENV === 'production' ? "/lobby" : "http://localhost:3000/lobby";
const oAuthGithub = require('./oauth-github');
const githubAuthoriser = oAuthGithub(oauthClientId, oauthSecret);

const db = (process.env.NODE_ENV === 'testing') ? require('../queries/testdb') : require('../queries/db');

router.get("/oauth", (req, res) => {
    githubAuthoriser.authorise(req, (githubUser, token) => {
        if (githubUser) {
            const username = githubUser.login;
            db.createGithubUser(username)
            .then(user => {
                if (getAllSockets().some(socket => socket.handshake.session.user.username === username)) {
                    res.status(400).json({ message: "You are already logged in this account from another computer." });
                } else {
                    const real = true;
                    const id = user.dataValues.id;
                    req.session.user = { username, id, real };
                    req.session.roomId = null;
                    res.header("Location", redirectURL);
                    res.sendStatus(302);
                }
            }).catch(err => {
                console.error(err);
                res.status(err.code).json({ message: err.message });
            });
        } else {
            res.sendStatus(404);
        }
    });
});

router.get("/api/oauth/uri", (req, res) => {
    res.status(200).json({ uri: githubAuthoriser.oAuthUri});
});

router.use('/api/room', require('./rooms'));
router.use('/api/images', require('./images'));

/* Check if player is logged in */
router.get('/auth', (req, res) => {
    const { user } = req.session;
    if (user) { /* The user session exists, authorised */
        res.status(200).json({ cookie: user.username });
    } else { /* The user session does not exist, unauthorised */
        res.status(401).json({ message: "You need to log in with a username to enter the game."});
    }
});

/* Log in the user */
router.post('/auth/signup', (req, res) => {
    const { username, password } = req.body;    
    db.createUser(username, password)
    .then(user => {
        const real = true;
        const id = user.dataValues.id;
        req.session.user = { username, id, real };
        req.session.roomId = null;
        res.sendStatus(200);
    }).catch(err => {
        console.error(err);
        res.status(err.code).json({ message: err.message });
    });
});

/* Log in the user */
router.post('/auth/login', (req, res) => {
    const { username, password } = req.body;    
    db.validatePassword(username, password)
    .then(user => {
        if (getAllSockets().some(socket => socket.handshake.session.user.username === username)) {
            res.status(400).json({ message: "You are already logged in this account from another computer." });
        } else {
            const real = true;
            const id = user.dataValues.id;
            req.session.user = { username, id, real };
            req.session.roomId = null;
            res.sendStatus(200);
        }
    }).catch(err => {
        console.error(err);
        res.status(err.code).json({ message: err.message });
    });
});

/* Log out the user */
router.post('/auth/logout', auth, (req, res) => {
    const { user, roomId } = req.session;
    try {
        if (roomId !== null) {
            const room = Room.getById(roomId);
            if (room) Room.removePlayer(room, user.username);
            emitRooms();
        }
        disconnectSocket(user.username);
        req.session.destroy();
        res.sendStatus(200);
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: err.message });
    }
});

/* Get the players list of cards */
router.get('/api/cards', auth, (req, res) => {
    const { user, roomId } = req.session;
    const gameState = Room.getById(roomId).gameState;
    const cards = gameState.getUnplayedCardsByUsername(user.username);
    if (cards) {
        (gameState.mode === 'custom'
        ? Promise.all(cards.map(card =>
            db.getCard(card.cardId)
            .then(other => ({
                ...card,
                url: other.dataValues.url
            }))))
        : Promise.resolve(cards))
        .then(cards => res.status(200).json(cards))
        .catch(err => res.status(500).json({ message: err.message }));
    }
    else {
        res.status(404).json({ message: "Cannot find cards: user does not exist." });
    }
});

/* Get the list of all players ever created with their scores */
router.get('/api/all-players', (req, res) => {
    db.getUsers()
    .then(users => res.status(200).json(users))
    .catch(err => {
        console.error(err);
        res.status(err.code).json({ message: err.message });
    });
});

/* Start the game */
router.get('/api/start', auth, (req, res) => {
    try {
        const roomId = req.session.roomId;
        Room.getById(roomId).gameState.startGame();
        emitRooms();
        res.sendStatus(200);
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: err.message });
    }
});

/* Invoke the new round */
router.get('/api/nextRound', auth, (req, res) => {    
    try {
        const roomId = req.session.roomId;
        Room.getById(roomId).gameState.nextRound();
        res.sendStatus(200);
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: err.message });
    }
});

/* Current player plays a card and a word */
router.post('/api/play-card-word', auth, (req, res) => {
    const { user, roomId } = req.session;
    const { word, cardId } = req.body;
    try {
        Room.getById(roomId).gameState.playCardAndWord(user.username, cardId, word); 
        res.sendStatus(200);
    } catch (err) { /* Player attempts to vote for a card again or game status is not appropriate */
        console.error(err);
        res.status(400).json({ message: err.message });
    }
});

/* Player plays a card */
router.post('/api/play-card', auth, (req, res) => {
    const { user, roomId } = req.session;
    const { cardId } = req.body;
    try {
        Room.getById(roomId).gameState.playCard(user.username, cardId)
        res.sendStatus(200);
    } catch (err) { /* Player attempts to vote for a card again or game status is not appropriate */
        res.status(400).json({ message: err.message });
    }
});

/* Player votes for a card */
router.post('/api/vote-card', auth, (req, res) => {
    const { user, roomId } = req.session;
    const { cardId } = req.body;
    try {
        Room.getById(roomId).gameState.voteCard(user.username, cardId)
        res.sendStatus(200);
    } catch (err) { /* Player attempts to vote for a card again or game status is not appropriate, or current player attempts to vote */
        console.error(err);
        res.status(400).json({ message: err.message });
    }
});

/* Check if in dev mode, and enable end game request */
if (process.env.NODE_ENV === 'testing') {
    router.post('/api/reset-server', (req, res) => {
        db.reset();
        disconnectAllSockets();
        Room.reset();
        req.session.destroy();
        res.sendStatus(200);
    });
}

/* Send index file */
router.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../build/index.html'), (err) => {
        if (err) {
            res.status(500);
            res.send(err);
        }
    });
});

module.exports = router;
