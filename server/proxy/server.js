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

app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());

app.get('/connect-and-play', (req, res) => {
    const url = req.query.url;
    
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
            socket = client('ws://localhost:8080/', {
                upgrade: false,
                transports: ['websocket']
            });
            socket.on('connect', () => {
                instance.get('api/cards')
                .then((response) => Promise.all([
                    response.data,
                    instance.get('api/start')
                ]))
                .then(([cards, startResponse]) => {
                    if (startResponse.status === 200) {
                        return instance.post('api/playCardWord', {
                            card: cards[0].id.toString(),
                            word: "Hello"
                        });
                    }
                })
                .then(() => res.sendStatus(200))
                .catch((err) => console.error(err));
            });
        }
    })
    .catch((err) => {
        console.error(err);
    });
    
});

app.get('/disconnect', (req, res) => {
    socket.on('disconnect', () => {
        res.sendStatus(200);
    });
    socket.disconnect();
})

app.listen(port, () => console.log(`Proxy server running on port: ${port}`));
