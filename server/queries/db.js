const Sequelize = require('sequelize');
const Promise = require('promise');
const bcrypt = require('bcrypt');
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
