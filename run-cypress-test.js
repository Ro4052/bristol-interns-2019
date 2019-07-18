const cypress = require('cypress');
const server = require('./server/server');

cypress.run()
.then((results) => {
  console.log(results.totalFailed);
  if (results.totalFailed > 0) {
    return server.fail();
  }
  return server.stop();
})
.catch((err) => {
  console.log(err);
  return server.fail();
})
