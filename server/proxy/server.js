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
 
let cookieJar = new tough.CookieJar();
const app = express();

let socket;

let cards;

app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());

app.get('/connect', (req, res) => {
    const url = req.query.url;
    const connectionString = "ws://localhost:12345/";

    const axiosInstance = axios.create({
        baseURL: url,
        timeout: 500,
        jar: cookieJar,
        withCredentials: true
    });
    
    axiosInstance.post('auth/login', { 
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

app.get('/logout', (req, res) => {
    const url = req.query.url;
    const axiosInstance = axios.create({
        baseURL: url,
        timeout: 500,
        jar: cookieJar,
        withCredentials: true
    });
    axiosInstance.post('auth/logout')
        .then(() => res.sendStatus(200))
        .catch((err) =>  res.send(err));
});

app.get('/startGame', (req, res) => {
    const url = req.query.url;
    const axiosInstance = axios.create({
        baseURL: url,
        timeout: 500,
        jar: cookieJar,
        withCredentials: true
    });
    axiosInstance.get('api/start')
    .then(() => res.sendStatus(200))
    .catch((err) =>  res.send(err));
});

app.get('/createRoom', (req, res) => {
    const url = req.query.url;
    const axiosInstance = axios.create({
        baseURL: url,
        timeout: 500,
        jar: cookieJar,
        withCredentials: true
    });
    axiosInstance.post('api/room/create')
    .then(() => res.sendStatus(200))
    .catch((err) => {
        console.log(err);
        res.send(err);
    });
})

app.get('/joinRoom', (req, res) => {
    const url = req.query.url;
    const roomId = req.query.roomId;
    const axiosInstance = axios.create({
        baseURL: url,
        timeout: 500,
        jar: cookieJar,
        withCredentials: true
    });
    const body = { roomId: parseInt(roomId) };
    axiosInstance.post('api/room/join', body)
    .then(() => {
        axiosInstance.get('api/cards')
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
    const axiosInstance = axios.create({
        baseURL: url,
        timeout: 500,
        jar: cookieJar,
        withCredentials: true
    });
    const body = { 
        cardId: cards[0].cardId,
        word: "Hello"
    };
    axiosInstance.post('api/play-card-word', body)
    .then(() => res.sendStatus(200))
    .catch((err) =>  res.send(err));
});

app.get('/playCard', (req, res) => {
    const url = req.query.url;
    const axiosInstance = axios.create({
        baseURL: url,
        timeout: 500,
        jar: cookieJar,
        withCredentials: true
    });
    const body = { 
        cardId: cards[0].cardId
    };
    axiosInstance.post('api/play-card', body)
    .then(() => res.sendStatus(200))
    .catch((err) =>  res.send(err));
});

app.get('/voteCard', (req, res) => {
    const url = req.query.url;
    const axiosInstance = axios.create({
        baseURL: url,
        timeout: 500,
        jar: cookieJar,
        withCredentials: true
    });
    const body = { 
        cardId: cards[0].cardId
    };
    axiosInstance.post('api/vote-card', body)
    .then(() => res.sendStatus(200))
    .catch((err) =>  res.send(err));
});

app.get('/disconnect', (req, res) => {
    if (socket) socket.disconnect(); // Needed because this is called in the before each, and socket is not set up yet in the first test
    cookieJar = new tough.CookieJar();
    res.sendStatus(200);
});

app.listen(port, () => console.log(`Proxy Server running on port: ${port}`));
