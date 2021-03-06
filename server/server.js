const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const expressSession = require('express-session');
const cors = require('cors');
const socket = require('./services/socket');

const app = express();
const server = require('http').createServer(app);

module.exports.server = (port) => {

    app.use(express.static('build'));
    app.use(bodyParser.json());
    app.use(cors());
    app.use(cookieParser());
    const session = expressSession({
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

process.on('SIGTERM', function () {
    server.close(function () {
      process.exit(0);
    });
});
