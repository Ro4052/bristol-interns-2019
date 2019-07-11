const client = require('socket.io-client')
const express = require('express')
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const cors = require('cors');
const axios = require('axios')
const app = express()

let socket
let cards;

app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());

app.get('/connect-and-play', (req, res) => {
    const url = req.query.url;

    socket = client(url);

    const instance = axios.create({
        baseURL: url,
        timeout: 500,
    });

    socket.on('connect', () => {
        instance.post('auth/login', { 
            username: "halfling" 
        })
        .then(() => {
            return instance.get('api/cards')
        })
        .then((response) => {
            cards = response.data;
            return instance.get('api/start')
        })
        .then((startResponse) => {
            if (startResponse.status === 200) {
                return instance.post('api/playCardWord', {
                    card: cards[0].id.toString(),
                    word: "Hello"
                })
            }
        })
        .then(() => {
            res.sendStatus(200);
        })
        .catch((err) => {
            console.error(err);
        });
    })
})
app.get('/connect', (req, res) => {
    const url = req.query.url;

    socket = client(url);

    const instance = axios.create({
        baseURL: url,
        timeout: 500,
    });

    socket.on('connect', () => {
        instance.post('auth/login', { 
            username: "halfling" 
        })
        .then(() => {
            return instance.get('api/cards')
        })
        .then((response) => {
            cards = response.data;
            return instance.get('api/start')
        })
        .then(() => {
            res.sendStatus(200);
        })
        .catch((err) => {
            console.error(err);
        });
    });
});

app.get('/disconnect', (req, res) => {
    socket.on('disconnect', () => {
        res.sendStatus(200)
    })
    socket.disconnect()
})

app.listen(8081, () => console.log('Server running on port: 8081'))
