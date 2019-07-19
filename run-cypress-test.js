const cypress = require('cypress');
const server = require('./server/server');

cypress.run()
.then((results) => {
  return (results.totalFailed > 0) ? server.fail() : server.stop();
})
.catch((err) => {
  console.log(err);
  return server.fail();
})
