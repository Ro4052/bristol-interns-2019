const cypress = require('cypress')
const server = require('./server/server')

cypress.run()
.then((results) => {
  return server.stop()
})