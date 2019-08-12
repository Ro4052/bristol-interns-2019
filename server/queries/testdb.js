const Promise = require('promise');

let users = [];
let nextId = 0;

module.exports.createUser = (username) => {
    return new Promise((resolve) => {        
        let user = users.find(user => user.username === username);
        if (!user) {
            user = { name: username, id: nextId, score: 0 };
            nextId++;
            users.push({dataValues: user});
        }
        resolve(users);
    });
}

module.exports.getUsers = () => {
    return new Promise((resolve) => {
        resolve(users);
    });
}

module.exports.updateScore = (id, score) => {    
    return new Promise((resolve) => {
        users.find(user => user.id === id).score += score;
        resolve();
    });
}
