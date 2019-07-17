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
                instance.get('api/cards')
                .then((response) => {
                    cards = response.data
                    res.sendStatus(200);
                })
                .catch((err) => res.sendStatus(err.statusCode));
            });
        }
    })
    .catch((err) => res.sendStatus(err.statusCode)); 
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
        .catch((err) => res.sendStatus(err.statusCode));
});

app.get('/playCardWord', (req, res) => {
    const url = req.query.url;
    const instance = axios.create({
        baseURL: url,
        timeout: 500,
        jar: cookieJar,
        withCredentials: true
    });
    
    instance.post('api/playCardWord', {
        cardId: cards[0].cardId,
        word: "Hello"
    })
    .then(() => {
        res.sendStatus(200);
    })
    .catch((err) => res.sendStatus(err.statusCode));
});

app.get('/disconnect', (req, res) => {
    socket.on('disconnect', () => {
        res.sendStatus(200);
    });
    socket.disconnect();
})

app.listen(port, () => console.log(`Proxy Server running on port: ${port}`));
