const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import cors
const app = express();
const PORT = process.env.PORT || 3001;
const SECRET_KEY = "your_secret_key";

app.use(bodyParser.json());
app.use(cors()); // Use cors

// Connect to the SQLite database file
const db = new sqlite3.Database('./mydatabase.db');

// Register endpoint
app.post('/register', (req, res) => {
    const { email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 8);

    db.run(`INSERT INTO users (email, password) VALUES (?, ?)`, [email, hashedPassword], function (err) {
        if (err) {
            return res.status(500).send("User registration failed");
        }
        res.status(200).send("User registered successfully");
    });
});

// Login endpoint
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, user) => {
        if (err) {
            return res.status(500).send("Internal server error");
        }
        if (!user) {
            return res.status(404).send("User not found");
        }

        const passwordIsValid = bcrypt.compareSync(password, user.password);
        if (!passwordIsValid) {
            return res.status(401).send("Invalid password");
        }

        const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: 86400 }); // 24 hours
        res.status(200).send({
            access_token: token,
            user: {
                email: user.email,
                username: user.username || "Default Username", // Handle case if username is null
                role: user.role || "User" // Handle case if role is null
            }
        });
    });
});



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
