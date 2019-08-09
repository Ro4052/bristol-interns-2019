const { Client } = require('pg');
const Promise = require('promise');

let pool;

console.log(process.env.DATABASE_URL);

if (process.env.DATABASE_URL) {
    pool = new Client({
        connectionString: process.env.DATABASE_URL
    });
} else {
    pool = new Client({
        user: 'me',
        host: 'localhost',
        database: 'telltales',
        password: 'password',
        port: 5432
    });
}

pool.connect((err) => {
    if (err) {
        console.error('Connection error', err.stack);
    } else {
        console.log("Connected");
    }
});

// Create the table if it doesn't already exist
/* eslint max-len: ["error", { "code": 200 }] */
const createTableQuery = 'CREATE TABLE IF NOT EXISTS users ( id SERIAL PRIMARY KEY, name VARCHAR(15) NOT NULL, score INT );'
pool.query(createTableQuery, 
    (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("Created table users");
    }
});

// Add a user to the table
module.exports.add = (username) => {
    return new Promise((resolve, reject) => {
        let query = 'INSERT INTO users (name, score) VALUES ($1, $2) RETURNING id';
        pool.query(query, [username, 0], (err, result) => {
            if (err) {
                reject({
                    code: 500,
                    msg: err
                })
            } else {
                var id = result.rows[0].id;
                resolve(id);
            }
        });
    });
}

// Get user by username
module.exports.get = (username) => {
    return new Promise((resolve, reject) => {
        let query = 'SELECT * FROM users WHERE name = $1';
        pool.query(query, [username], (err, result) => {
            if (err) {
                reject({
                    code: 404,
                    msg: err
                })
            } else {
                resolve(result.rows[0]);
            }
        });
    });
}

// Add a user to the table
module.exports.updateScores = (players) => {
    return new Promise((resolve, reject) => {
        players.forEach(player => {            
            let getUser = 'SELECT * FROM users WHERE name = $1';
            pool.query(getUser, [player.username], (err, result) => {
                if (err) {
                    reject({
                        code: 404,
                        msg: err
                    })
                } else {
                    const user = result.rows[0];    
                    pool.query('UPDATE users SET score = $1 WHERE id = $2',
                        [player.score + user.score, player.id],
                        (error) => {
                            if (error) {
                                reject({
                                    code: 500,
                                    msg: error
                                })
                            }                          
                        }
                    )
                }
            });
        });
        resolve(players);
    });
}
