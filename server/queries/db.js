const Sequelize = require('sequelize');
const Promise = require('promise');
const bcrypt = require('bcrypt');
const UserModel = require("./user");
const CardLabelsModel = require("./cardLabels");
const CardImagesModel = require("./cardImages");
const db_url = process.env.DATABASE_URL || `postgres://${process.env.DB_USER}:${process.env.DB_PASS}@localhost:5432/${process.env.DB_NAME}`;

const sequelize = new Sequelize(db_url, {
    dialect: "postgres",
    dialectOptions: {
      ssl: process.env.DATABASE_SSL || false
    },
    dialectModule: require('pg')
});

const User = UserModel(sequelize, Sequelize);
const CardLabels = CardLabelsModel(sequelize, Sequelize);
const CardImages = CardImagesModel(sequelize, Sequelize);

sequelize.sync({ alter: true }).then(() => {
    console.log("Database connected.");
});

module.exports.validatePassword = (username, password) => {
    return new Promise((resolve, reject) => {
        User.findOne({
            where: { username }
        })
        .then(user => {
            if (user) {
                bcrypt.compare(password, user.dataValues.password, (err, res) => {                    
                    if (res) {
                        resolve(user);
                    } else {
                        reject({
                            code: 401,
                            message: "Password is incorrect"
                        });
                    }
                });
            } else {
                reject({
                    code: 400,
                    message: "User with this username does not exist"
                });
            }
        })
        .catch(err => {
            reject({
                code: 400,
                message: err.message
            });
        });
    });
}

module.exports.addLabel = (cardId, word) => {
    return new Promise((resolve, reject) => {
        CardLabels.findOne({
            where: { cardId }
        }).then(card => {
            const labels = card.dataValues.labels;
            if (!labels.includes(word)) {
                labels.push(word);
                card.update({
                    labels: labels
                })
                .then(() => resolve())
                .catch(err => {
                    reject({
                        code: 404,
                        message: err.message
                    });
               });
            }
        });
    });
}

module.exports.addCard = (etag, url) => {
    return new Promise((resolve, reject) => {
        CardImages.findOrCreate({
            where: { etag },
            defaults: { // set the default properties if it doesn't exist
                etag,
                url
            }
        }).then(([card, created]) => {
            if (created) {
                resolve(card);
            }
            reject({
                code: 409,
                message: "Card already exists in the database"
            });
        });
    });
}

module.exports.getAllCards = () => {
    return new Promise((resolve, reject) => {
        CardImages.findAll()
        .then(cards => {
            if (cards) {
                resolve(cards);
            }
            reject({
                code: 404,
                message: "No cards are found in the database."
            });
        });
    });
}

module.exports.getCard = (id) => {
    return new Promise((resolve, reject) => {
        CardImages.findOne({
            where: { id }
        }).then(card => {
            if (card) {
                resolve(card);
            }
            reject({
                code: 404,
                message: "Card with this id is not found in the database."
            });
        });
    });
}

module.exports.createUser = (username, password) => {
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, 10, (err, hash) => {
            if (err) {
                reject({
                    code: 400,
                    message: err.message
                });
            }
            User.findOrCreate({
                where: { username },
                defaults: { // set the default properties if it doesn't exist
                    username,
                    password: hash,
                    score: 0
                }
            })
            .then(([user, created]) => {                
                if (created) {
                    resolve(user);
                }
                reject({
                    code: 400,
                    message: "User with this username already exists"
                });
            })
            .catch(err => {
                reject({
                    code: 404,
                    message: err.message
                });
            });
        });
    });
}

module.exports.createGithubUser = username => {
    return new Promise((resolve, reject) => {
        User.findOrCreate({
            where: { username },
            defaults: { // set the default properties if it doesn't exist
                username: username.trim(),
                password: "",
                score: 0
            }
        })
        .then(([user, created]) => resolve(user))
        .catch(err => {
            reject({
                code: 404,
                message: err.message
            });
        });
    });
}

module.exports.getUsers = () => {
    return new Promise((resolve, reject) => {
        User.findAll()
        .then(users => resolve(users))
        .catch(err => {
            reject({
                code: 404,
                message: err.message
            });
        });
    });
}

module.exports.updateScore = (id, score) => {
    return new Promise((resolve, reject) => {
        User.findByPk(id).then(player => {
            player.update({
                score: Sequelize.literal(`score + ${score}`)
            }, {
                where: { id }
            })
            .then(() => resolve())
            .catch(err => {
                reject({
                    code: 404,
                    message: err.message
                });
            });
        });
    });
}

module.exports.getLabels = cardId => {
    return new Promise((resolve, reject) => {
        CardLabels.findOne({
            where: { cardId }
        })
        .then(card => resolve(card))
        .catch(err => {
            reject({
                code: 400,
                message: err.message
            });
        });
    });
}
