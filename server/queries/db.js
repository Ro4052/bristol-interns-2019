const Sequelize = require('sequelize');
const Promise = require('promise');
const UserModel = require("./user");
const db_url = process.env.DATABASE_URL || `postgres://${process.env.DB_USER}:${process.env.DB_PASS}@localhost:5432/${process.env.DB_NAME}`;

const sequelize = new Sequelize(db_url, {
    dialect: "postgres",
    dialectOptions: {
      ssl: process.env.DATABASE_SSL || false
    },
    dialectModule: require('pg')
});

const User = UserModel(sequelize, Sequelize);

sequelize.sync({ alter: true }).then(() => {
    console.log("Database connected.");
});

module.exports.createUser = username => {
    return new Promise((resolve, reject) => {
        User.findOrCreate({
            where: {
                username: username
            },
            defaults: { // set the default properties if it doesn't exist
                username: username.trim(),
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

module.exports.getUsers = () => {
    return new Promise((resolve, reject) => {
        User.findAll()
        .then(users => resolve(users))
        .catch(err => {
            reject({
                code: 404,
                msg: err.message
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
