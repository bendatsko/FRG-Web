const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');

// Connect to the SQLite database
const db = new sqlite3.Database('./mydatabase.db');

// User details
const email = 'john@mail.com';
const password = 'changeme';

// Hash the password
const hashedPassword = bcrypt.hashSync(password, 8);

// SQL query to insert a new user
const sql = `INSERT INTO users (email, password) VALUES (?, ?)`;

// Insert the new user into the database
db.run(sql, [email, hashedPassword], function(err) {
    if (err) {
        return console.error("User insertion failed:", err.message);
    }
    console.log(`A new user has been inserted with ID ${this.lastID}`);
});

// Close the database connection
db.close((err) => {
    if (err) {
        return console.error("Failed to close the database connection:", err.message);
    }
    console.log('Database connection closed.');
});
