const cypress = require('cypress');
const server = require('./server/server');

const options = {};
const args = process.argv;

console.log("args: ", args);

const index = args.findIndex(arg => arg === '--');
if (index !== -1 && index < args.length - 1) {
    const spec = `{${args.slice(index + 1).join(',')}}`;
    Object.assign(options, { spec });
}

console.log("options: ", options);

cypress.run(options)
.then(results => {
  return (results.totalFailed > 0) ? server.fail() : server.stop();
})
.catch(err => {
  console.log(err);
  return server.fail();
});
