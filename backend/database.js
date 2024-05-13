const sqlite3 = require('sqlite3').verbose();

// open the database
let db = new sqlite3.Database('./db.sqlite', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the SQlite database.');
});

db.run(`CREATE TABLE users(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
)`, (err) => {
    if (err) {
        // Table already created
    } else {
        console.log('Users table created');
    }
});
db.run(`CREATE TABLE files(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    file_name TEXT NOT NULL UNIQUE,
    last_updated TEXT NOT NULL
)`, (err) => {
    if (err) {
        // Table already created
    } else {
        console.log('Files table created');
    }
});

module.exports = db;