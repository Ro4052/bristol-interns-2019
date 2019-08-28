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
    User.findOne({
        where: { username }
    })
    .then(user => {
        if (user) {
            bcrypt.compare(password, user.dataValues.password, (err, res) => {                    
                if (res) {
                    return user;
                } else {
                    throw new Error("Password is incorrect");
                }
            });
        } else {
            throw new Error("User with this username does not exist");
        }
    })
    .catch(err => { throw new Error(err.message) });
}

module.exports.addLabel = (cardId, word) => {
    CardLabels.findOne({
        where: { cardId }
    }).then(card => {
        const labels = card.dataValues.labels;
        if (!labels.includes(word)) {
            labels.push(word);
            card.update({
                labels: labels
            })
            .then(() => {})
            .catch(err => { throw new Error(err.message) });
        }
    });
}

module.exports.addCard = (etag, url) => 
    CardImages.findOrCreate({
        where: { etag },
        defaults: { // set the default properties if it doesn't exist
            etag,
            url
        }
    }).then(([card, created]) => {
        if (created) {
            return card;
        }
        throw new Error("Card already exists in the database");
    })

module.exports.getAllCards = () => 
    CardImages.findAll()
    .then(cards => {
        if (cards) {
            return cards;
        }
        throw new Error("No cards are found in the database.");
    });

module.exports.getCard = (id) => 
    CardImages.findOne({
        where: { id }
    }).then(card => {
        if (card) {
            return card ;
        }
        throw new Error("Card with this id is not found in the database.");
    });


module.exports.createUser = (username, password) => 
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            throw new Error(err.message);
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
                return user;
            }
            throw new Error("User with this username already exists");
        })
        .catch(err => { throw new Error(err.message) });
    });


module.exports.createGithubUser = username => 
    User.findOrCreate({
        where: { username },
        defaults: { // set the default properties if it doesn't exist
            username: username.trim(),
            password: "",
            score: 0
        }
    })
    .then(([user, created]) => user)
    .catch(err => { throw new Error(err.message) });


module.exports.getUsers = () => 
    User.findAll()
    .then(users => users)
    .catch(err => { throw new Error(err.message) });


module.exports.updateScore = (id, score) => 
    User.findByPk(id).then(player => {
        player.update({
            score: Sequelize.literal(`score + ${score}`)
        }, {
            where: { id }
        })
        .then(() => {})
        .catch(err => { throw new Error(err.message) });
    });


module.exports.getLabels = cardId => 
    CardLabels.findOne({
        where: { cardId }
    })
    .then(card => card)
    .catch(err => { throw new Error(err.message) });

