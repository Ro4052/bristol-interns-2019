const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookie = require('cookie');

const sampleArray = ['Hello', 'World', '!'];

module.exports = port => {
  const app = express();
  const server = require('http').createServer(app);
  const io = require('socket.io')(server);

  app.use(express.static('build'));
  app.use(bodyParser.json());
  app.use(cors());

  server.listen(port, () => console.log(`Server running on port: ${port}`));

  // Send index file
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../build/index.html'), (err) => {
      if (err) {
        res.status(500);
        res.send(err);
      }
    });
  });

  // REST example
  app.get('/api/hello', (request, response) => {
    response.json(sampleArray);
  });

  // Socket.io
  io.on('connection', function (socket) {
    console.log("Someone connected.");
  });

  // Log in the user
  app.post('/auth/login', (req, res) => {
    res.cookie(cookie.serialize('username', req.body.username), {
      httpOnly: true,
      expires: (10 * 365 * 24 * 60 * 60)
    })
    res.status(200).json("Logged in");
  })

}
