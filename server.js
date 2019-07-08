require('dotenv').config();
const app = require('./server/server');

const port = process.env.PORT || 8080;
app.server(port);
