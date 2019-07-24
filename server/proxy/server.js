const client = require('socket.io-client');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const axios = require('axios').default;
const axiosCookieJarSupport = require('axios-cookiejar-support').default;
const tough = require('tough-cookie');

const port = process.env.PORT || 8081;

axiosCookieJarSupport(axios);
 
const cookieJar = new tough.CookieJar();
const app = express();

let socket;

let cards;

app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());

app.get('/connect', (req, res) => {
    const url = req.query.url;
    const connectionString = "ws://localhost:12345/";

    const instance = axios.create({
        baseURL: url,
        timeout: 500,
        jar: cookieJar,
        withCredentials: true
    });
    
    instance.post('auth/login', { 
        username: "halfling" 
    })
    .then((response) => {
        if (response.status === 200) {
            socket = client(connectionString, {
                upgrade: false,
                transportOptions: {
                    polling: {
                        extraHeaders: {
                            cookie: cookieJar.getCookieStringSync(url)
                        }
                    }
                }
            });
            socket.on('connect', () => {
                res.sendStatus(200);
            });
        }
    })
    .catch((err) => {
        console.error(err);
        res.status(err.response.status).json(err.response.data);
    }); 
});

app.get('/startGame', (req, res) => {
    const url = req.query.url;
    const instance = axios.create({
        baseURL: url,
        timeout: 500,
        jar: cookieJar,
        withCredentials: true
    });
    instance.get('api/start')
        .then(() => res.sendStatus(200))
        .catch((err) =>  res.send(err));
});

app.get('/createRoom', (req, res) => {
    const url = req.query.url;
    const instance = axios.create({
        baseURL: url,
        timeout: 500,
        jar: cookieJar,
        withCredentials: true
    });
    instance.get('api/room/create')
    .then(() => res.sendStatus(200))
    .catch((err) => {
        console.log(err);
        res.send(err);
    });
})

app.get('/joinRoom', (req, res) => {
    const url = req.query.url;
    const roomId = req.query.roomId;
    const instance = axios.create({
        baseURL: url,
        timeout: 500,
        jar: cookieJar,
        withCredentials: true
    });
    const body = { roomId: parseInt(roomId) };
    instance.post('api/room/join', body)
    .then(() => {
        instance.get('api/cards')
        .then((response) => {
            cards = response.data;
            res.sendStatus(200);
        })
        .catch((err) => res.send(err));
    })
    .catch((err) => res.send(err));
});

app.get('/playCardWord', (req, res) => {
    const url = req.query.url;
    const instance = axios.create({
        baseURL: url,
        timeout: 500,
        jar: cookieJar,
        withCredentials: true
    });
    const body = { 
        cardId: cards[0].cardId,
        word: "Hello"
    };
    instance.post('api/playCardWord', body)
    .then(() => res.sendStatus(200))
    .catch((err) =>  res.send(err));
});

app.get('/playCard', (req, res) => {
    const url = req.query.url;
    const instance = axios.create({
        baseURL: url,
        timeout: 500,
        jar: cookieJar,
        withCredentials: true
    });
    const body = { 
        cardId: cards[0].cardId
    };
    instance.post('api/playCard', body)
    .then(() => res.sendStatus(200))
    .catch((err) =>  res.send(err));
});

app.get('/disconnect', (req, res) => {
    if (socket) socket.disconnect(); // Needed because this is called in the before each, and socket is not set up yet in the first test
    res.sendStatus(200);
});

app.listen(port, () => console.log(`Proxy Server running on port: ${port}`));
