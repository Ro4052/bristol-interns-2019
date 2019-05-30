require('dotenv').config();
const server = require('./server/server');

const port = process.env.PORT || 8080;
server(port);
