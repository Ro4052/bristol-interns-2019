const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const expressSession = require('express-session');
const cors = require('cors');
const socket = require('./services/socket');

module.exports = port => {
    const app = express();
    const server = require('http').createServer(app);
    
    app.use(express.static('build'));
    app.use(bodyParser.json());
    app.use(cors());
    app.use(cookieParser());
    var session = expressSession({
        name: 'username',
        secret: 'my-cool-secret',
        resave: false,
        saveUninitialized: false,
        secure: true
    });
    app.use(session);
    
    socket.setupSocket(server, session);

    app.use(require('./controllers'));

    server.listen(port, () => console.log(`Server running on port: ${port}`));

}
