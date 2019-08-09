const Promise = require('promise');

let users = [];
let nextId = 0;

module.exports.reset = () => {
    users = [];
    nextId = 0;
}

module.exports.findOrCreate = (username) => {
    return new Promise((resolve) => {
        const user = { username, id: nextId, score: 0 };
        nextId++;
        users.push(user);
        const data = {
            dataValues: user
        }
        resolve([data]);
    });
}

module.exports.update = () => {    
    return new Promise((resolve) => {
        resolve();
    });
}
