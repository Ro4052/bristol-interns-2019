const Promise = require('promise');

let users = [];
let nextId = 0;

module.exports.reset = () => {
    users = [];
    nextId = 0;
}

module.exports.add = (username) => {
    return new Promise((resolve) => {
        const user = { username, id: nextId.toString(), score: 0 };
        nextId++;
        users.push(user);
        resolve(user.id);
    })
}

module.exports.get = (username) => {
    return new Promise((resolve) => {        
        resolve(users.find(user => user.username === username));
    })
}

module.exports.updateScores = (players) => {
    return new Promise((resolve) => {
        players.forEach(player => {
            users.find(user => user.username === player.username).score += player.score;
        });
        resolve(users);
    })
}