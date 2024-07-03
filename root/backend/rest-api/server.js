const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;
const SECRET_KEY = "your_secret_key";
const {v4: uuidv4} = require('uuid');


app.use(bodyParser.json());
app.use(cors());


/* -------------------------------------------------------------------------- */
/*                              Database connect                              */
/* -------------------------------------------------------------------------- */

// Connect to SQLite database
const db = new sqlite3.Database('../data.db', (err) => {
    if (err) {
        console.error('Could not connect to database', err);
    } else {
        console.log('Connected to database');
    }
});

// SERIALIZE DATABASE
db.serialize(() => {
    db.run("ALTER TABLE users ADD COLUMN uuid TEXT", (err) => {
        if (err && err.message.indexOf("duplicate column name: uuid") === -1) {
            console.error("Error adding uuid column:", err);
            return;
        }

        db.each("SELECT id FROM users WHERE uuid IS NULL OR uuid = ''", (err, row) => {
            if (err) {
                console.error("Error fetching users without uuid:", err);
                return;
            }

            const newUuid = uuidv4();
            db.run("UPDATE users SET uuid = ? WHERE id = ?", [newUuid, row.id], (err) => {
                if (err) {
                    console.error("Error updating user with uuid:", err);
                } else {
                    console.log(`User with id ${row.id} updated with uuid ${newUuid}`);
                }
            });
        });
    });
});


/* -------------------------------------------------------------------------- */
/*                              Authentication                                */
/* -------------------------------------------------------------------------- */

// Register
app.post('/register', (req, res) => {
    const {email, password} = req.body;
    const hashedPassword = bcrypt.hashSync(password, 8);

    db.run(`INSERT INTO users (email, password) VALUES (?, ?)`, [email, hashedPassword], function (err) {
        if (err) {
            console.error('Error during user registration', err);
            return res.status(500).send("User registration failed");
        }
        res.status(200).send("User registered successfully");
    });
});

// Login
app.post('/login', (req, res) => {
    const {email, password} = req.body;

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

        const token = jwt.sign({id: user.id}, SECRET_KEY, {expiresIn: 86400}); // 24 hours
        res.status(200).send({
            access_token: token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                uuid: user.uuid,
                role: user.role,
                bio: user.bio,
            }
        });
    });
});


/* -------------------------------------------------------------------------- */
/*                              User endpoints                                */
/* -------------------------------------------------------------------------- */

// Fetch users
app.get('/users', (req, res) => {
    db.all(`SELECT email FROM users`, [], (err, rows) => {
        if (err) {
            console.error('Error fetching users:', err);
            return res.status(500).send("Internal server error");
        }
        res.status(200).json(rows);
    });
});

// Fetch user by uuid
app.get('/user/uuid/:uuid', (req, res) => {
    const {uuid} = req.params;

    console.log(`Fetching user with UUID: ${uuid}`); // Debugging line

    db.get(`SELECT id, username, email, uuid, role, bio FROM users WHERE uuid = ?`, [uuid], (err, user) => {
        if (err) {
            console.error('Error fetching user information', err);
            return res.status(500).send("Internal server error");
        }
        if (!user) {
            console.log(`User not found for UUID: ${uuid}`); // Debugging line
            return res.status(404).send("User not found");
        }
        res.status(200).json(user);
    });
});

// Update user by uuid
app.put('/user/:id', (req, res) => {
    const {id} = req.params;
    const {username, email, uuid, role, bio, currentPassword, newPassword} = req.body;

    // Fetch current user
    db.get(`SELECT * FROM users WHERE id = ?`, [id], (err, user) => {
        if (err) {
            console.error('Error fetching user information', err);
            return res.status(500).send("Internal server error");
        }
        if (!user) {
            return res.status(404).send("User not found");
        }

        // Validate current password
        const passwordIsValid = bcrypt.compareSync(currentPassword, user.password);
        if (!passwordIsValid) {
            return res.status(401).send("Invalid current password");
        }

        // Hash new password if provided
        let hashedPassword = user.password;
        if (newPassword) {
            hashedPassword = bcrypt.hashSync(newPassword, 8);
        }

        // Update user information
        db.run(`UPDATE users SET username = ?, email = ?, uuid = ?, password = ?, role = ?, bio = ? WHERE id = ?`,
            [username, email, uuid, hashedPassword, role, bio, id], function (err) {
                if (err) {
                    console.error('Error updating user information', err);
                    return res.status(500).send("User update failed");
                }
                res.status(200).send("User updated successfully");
            });
    });
});


/* -------------------------------------------------------------------------- */
/*                             Tests Endpoints                                */
/* -------------------------------------------------------------------------- */


// Fetch tests
app.get('/tests', (req, res) => {
    db.all(`SELECT * FROM tests`, [], (err, rows) => {
        if (err) {
            console.error('Error fetching tests:', err);
            return res.status(500).send("Internal server error");
        }
        res.status(200).json(rows);
    });
});

// Create test
app.post('/tests', (req, res) => {
    const {title, author, DUT, status, duration, user_id} = req.body;

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

// Edit test
app.put('/tests/:id', (req, res) => {
    const {id} = req.params;
    const {title, author, DUT, status, duration} = req.body;

    db.run(`UPDATE tests SET title = ?, author = ?, DUT = ?, status = ?, duration = ? WHERE id = ?`,
        [title, author, DUT, status, duration, id], function (err) {
            if (err) {
                console.error('Error modifying test', err);
                return res.status(500).send("Test modification failed");
            }
            res.status(200).send("Test modified successfully");
        });
});

// Delete test
app.delete('/tests/:id', (req, res) => {
    const {id} = req.params;

    db.run(`DELETE FROM tests WHERE id = ?`, [id], function (err) {
        if (err) {
            console.error('Error deleting test', err);
            return res.status(500).send("Test deletion failed");
        }
        res.status(200).send("Test deleted successfully");
    });
});


app.listen(PORT, () => {
    console.log(`Rest API started. Running on port ${PORT}`);
});
