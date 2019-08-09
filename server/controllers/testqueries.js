const Promise = require('promise');

let users = [];
let nextId = 0;

module.exports.sequelize = () => {
    console.log("Hi");
    
    return sync = () => {
        return new Promise(resolve => resolve());
    }
}

module.exports.reset = () => {
    users = [];
    nextId = 0;
}

module.exports.findOrCreate = (username) => {
    return new Promise((resolve) => {
        const user = { username, id: nextId.toString(), score: 0 };
        nextId++;
        users.push(user);
        resolve(user);
    })
}

module.exports.findByPk = (id) => {
    return new Promise((resolve) => {        
        resolve(users.find(user => user.id === id));
    })
}

module.exports.update = (players) => {
    return new Promise((resolve) => {
        players.forEach(player => {
            users.find(user => user.username === player.username).score += player.score;
        });
        resolve(users);
    })
}
