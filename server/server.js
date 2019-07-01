const express = require('express');
const expressWs = require('express-ws');
const path = require('path');
const bodyParser = require('body-parser');
const cookie = require('cookie');

const sampleArray = ['Hello', 'World', '!'];

module.exports = port => {
  const app = expressWs(express()).app;

  app.use(express.static('build'));
  app.use(bodyParser.json());

  // REST example
  app.get('/api/hello', (request, response) => {
    response.json(sampleArray);
  });

  // WebSocket example
  app.ws('/socket', (socket, request) => {
    console.log('Socket opened');

    socket.on('message', message => {
      // Ping
      console.log(message);
      socket.send('pong');
    })
  });

  // Send index file
  app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build/index.html'), (err) => {
      if (err) {
        res.status(500);
        res.send(err);
      }
    });
  });

  // Log in the user
  app.post('/auth/login', (req, res) => {
    res.cookie(cookie.serialize('username', req.body.username), {
      httpOnly: true,
      expires: (10 * 365 * 24 * 60 * 60)
    })
    res.status(200).json("Logged in");
  })
  
  return app.listen(port, () => console.log(`Server running on port: ${port}`));

}
