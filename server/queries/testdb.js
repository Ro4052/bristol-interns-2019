const Promise = require('promise');

let users = [];
let nextId = 0;

module.exports.reset = () => {
    return new Promise(resolve => {
        users = [];
        nextId = 0;
        resolve();
    });
}
module.exports.createUser = username => {
    return new Promise(resolve => {        
        let user = users.find(user => user.username === username);
        if (!user) {
            user = { username, id: nextId, score: 0 };
            nextId++;
            users.push(user);
        }
        const data = {
            dataValues: user
        }
        resolve([data]);
    });
}

module.exports.getUsers = () => {
    return new Promise(resolve => {
        resolve(users);
    });
}

module.exports.updateScore = (id, score) => {    
    return new Promise(resolve => {
        users.find(user => user.id === id).score += score;
        resolve();
    });
}
