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

module.exports.createUser = (username, password) => {
    return new Promise((resolve, reject) => {        
        let user = users.find(user => user.username === username);
        if (!user) {
            user = { username, id: nextId, score: 0 };
            nextId++;
            users.push(user);
            const data = {
                dataValues: user
            }
            resolve(data);
        } else {
            reject({
                code: 400,
                message: "User with this username already exists"
            });
        }
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

module.exports.getLabels = () => {
    return new Promise(resolve => {
        const data = {
            dataValues: {
                labels: ["hello"]
            }
        }
        resolve(data);
    });
}
