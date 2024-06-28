const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;
const SECRET_KEY = "your_secret_key";

app.use(bodyParser.json());
app.use(cors());

// Connect to the SQLite database file
const db = new sqlite3.Database('./mydatabase.db', (err) => {
    if (err) {
        console.error('Could not connect to database', err);
    } else {
        console.log('Connected to database');
    }
});

// Register endpoint
app.post('/register', (req, res) => {
    const { email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 8);

    db.run(`INSERT INTO users (email, password) VALUES (?, ?)`, [email, hashedPassword], function (err) {
        if (err) {
            console.error('Error during user registration', err);
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
            console.error('Error during login', err);
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
                email: user.email
            }
        });
    });
});

// Fetch all users endpoint
app.get('/users', (req, res) => {
    db.all(`SELECT email FROM users`, [], (err, rows) => {
        if (err) {
            console.error('Error fetching users:', err);
            return res.status(500).send("Internal server error");
        }
        res.status(200).json(rows);
    });
});

// Fetch all tests endpoint
app.get('/tests', (req, res) => {
    db.all(`SELECT * FROM tests`, [], (err, rows) => {
        if (err) {
            console.error('Error fetching tests:', err);
            return res.status(500).send("Internal server error");
        }
        res.status(200).json(rows);
    });
});

// Create test endpoint
app.post('/tests', (req, res) => {
    const { title, author, DUT, status, duration, user_id } = req.body;

    db.run(`INSERT INTO tests (title, author, DUT, status, duration, user_id) VALUES (?, ?, ?, ?, ?, ?)`,
        [title, author, DUT, status, duration, user_id], function (err) {
            if (err) {
                console.error('Error creating test', err);
                return res.status(500).send("Test creation failed");
            }
            res.status(200).send({
                message: "Test created successfully",
                testId: this.lastID
            });
        });
});

// Modify test endpoint
app.put('/tests/:id', (req, res) => {
    const { id } = req.params;
    const { title, author, DUT, status, duration } = req.body;

    db.run(`UPDATE tests SET title = ?, author = ?, DUT = ?, status = ?, duration = ? WHERE id = ?`,
        [title, author, DUT, status, duration, id], function (err) {
            if (err) {
                console.error('Error modifying test', err);
                return res.status(500).send("Test modification failed");
            }
            res.status(200).send("Test modified successfully");
        });
});

// Delete test endpoint
app.delete('/tests/:id', (req, res) => {
    const { id } = req.params;

    db.run(`DELETE FROM tests WHERE id = ?`, [id], function (err) {
        if (err) {
            console.error('Error deleting test', err);
            return res.status(500).send("Test deletion failed");
        }
        res.status(200).send("Test deleted successfully");
    });
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
