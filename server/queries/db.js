const Sequelize = require('sequelize');
const Promise = require('promise');
const UserModel = require("./user");
const db_url = process.env.DATABASE_URL || `postgres://${process.env.DB_USER}:${process.env.DB_PASS}@localhost:5432/${process.env.DB_NAME}`;

const sequelize = new Sequelize(db_url, {
    logging: false
});

const User = UserModel(sequelize, Sequelize);

sequelize.sync({ alter: true }).then(() => {
    console.log("Database connected.");
});

module.exports.createUser = username => {
    return new Promise((resolve, reject) => {
        User.findOrCreate({
            where: {
                name: username
            },
            defaults: { // set the default properties if it doesn't exist
                name: username.trim(),
                score: 0
            }
        })
        .then(users => resolve(users))
        .catch(err => {
            reject({
                code: 404,
                msg: err.message
            })
        });
    });
}

module.exports.getUser = (callback) => {
    User.findAll().then(todos => callback(todos));
}

module.exports.updateScore = id => {
    return new Promise((resolve, reject) => {
        User.findByPk(id).then(player => {
            player.update({
                score: Sequelize.literal(`score + ${player.score}`)
            }, {
                where: {
                    id: id
                }
            })
            .then(() => resolve())
            .catch(err => {
                reject({
                    code: 404,
                    msg: err.message
                });
            });
        });
    });
}
