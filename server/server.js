const express = require('express');
const expressWs = require('express-ws');
const path = require('path');
const bodyParser = require('body-parser');

const sampleArray = ['Hello', 'World', '!'];

module.exports = port => {
  const app = expressWs(express()).app;

  app.use(express.static('public'));
  app.use(bodyParser.json());

  // REST example
  app.get('/api/hello', (request, response) => {
    response.json(sampleArray);
  });

  // WebSocket example
  app.ws('/api/socket', (socket, request) => {
    console.log('Socket opened');

    socket.on('message', message => {
      // Ping
      socket.send('pong');
    })
  });

  // Send index file
  app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'), (err) => {
      if (err) {
        res.status(500);
        res.send(err);
      }
    });
  });

  return app.listen(port, () => console.log(`Server running on port: ${port}`));

}
