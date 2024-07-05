const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;
const SECRET_KEY = "your_secret_key";
const { v4: uuidv4 } = require('uuid');

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

    db.run(`CREATE TABLE IF NOT EXISTS tests (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        author TEXT NOT NULL,
        testBench TEXT,
        snrRange TEXT,
        batchSize INTEGER,
        user_id INTEGER,
        accessible_to TEXT,
        DUT TEXT,
        status TEXT NOT NULL,
        duration INTEGER NOT NULL
    )`);
    
    
    

    db.run(`CREATE TABLE IF NOT EXISTS notifications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        message TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        read BOOLEAN DEFAULT 0,
        FOREIGN KEY (user_id) REFERENCES users(id)
    )`);


});


/* -------------------------------------------------------------------------- */
/*                              Authentication                                */
/* -------------------------------------------------------------------------- */

// Register -- added some things 7/4/24
app.post('/register', (req, res) => {
    const {email, password, username, bio} = req.body;
    const hashedPassword = bcrypt.hashSync(password, 8);
    const uuid = uuidv4();

    db.run(`INSERT INTO users (email, password, username, bio, uuid) VALUES (?, ?, ?, ?, ?)`, 
           [email, hashedPassword, username, bio, uuid], function (err) {
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


// // Password reset
// app.post('/reset-password', (req, res) => {
//     const {userId, newPassword} = req.body;
//     const hashedPassword = bcrypt.hashSync(newPassword, 8);

//     db.run(`UPDATE users SET password = ? WHERE id = ?`, [hashedPassword, userId], function (err) {
//         if (err) {
//             console.error('Error resetting password', err);
//             return res.status(500).send("Password reset failed");
//         }
//         res.status(200).send("Password reset successfully");
//     });
// });


/* -------------------------------------------------------------------------- */
/*                              User endpoints                                */
/* -------------------------------------------------------------------------- */

// Fetch users
app.get('/users', (req, res) => {
    db.all(`SELECT id, email, username, role, bio FROM users`, [], (err, rows) => {
        if (err) {
            console.error('Error fetching users:', err);
            return res.status(500).send("Internal server error");
        }
        res.status(200).json(rows);
    });
});


// Fetch user by id
app.get('/users/:id', (req, res) => {
    const { id } = req.params;
    db.get(`SELECT id, username, email, uuid, role, bio FROM users WHERE id = ?`, [id], (err, user) => {
        if (err) {
            console.error('Error fetching user information', err);
            return res.status(500).send("Internal server error");
        }
        if (!user) {
            return res.status(404).send("User not found");
        }
        res.status(200).json(user);
    });
});


// Update user
app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const { username, email, role, bio } = req.body;

    db.run(`UPDATE users SET username = ?, email = ?, role = ?, bio = ? WHERE id = ?`,
        [username, email, role, bio, id], function (err) {
            if (err) {
                console.error('Error updating user information', err);
                return res.status(500).send("User update failed");
            }
            res.status(200).send("User updated successfully");
        });
});



// Delete user
app.delete('/users/:id', (req, res) => {
    const { id } = req.params;

    db.run(`DELETE FROM users WHERE id = ?`, [id], function (err) {
        if (err) {
            console.error('Error deleting user', err);
            return res.status(500).send("User deletion failed");
        }
        res.status(200).send("User deleted successfully");
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


// Password reset (per user)
app.post('/reset-password', (req, res) => {
    const { userId, newPassword } = req.body;

    // Fetch the user from the database to obtain the username
    db.get(`SELECT * FROM users WHERE id = ?`, [userId], (err, user) => {
        if (err) {
            console.error('Error fetching user information', err);
            return res.status(500).send("Internal server error");
        }
        if (!user) {
            return res.status(404).send("User not found");
        }

        // Hash the new password
        const hashedPassword = bcrypt.hashSync(newPassword, 8);

        // Update the user's password in the database
        db.run(`UPDATE users SET password = ? WHERE id = ?`, [hashedPassword, userId], function (err) {
            if (err) {
                console.error('Error resetting password', err);
                return res.status(500).send("Password reset failed");
            }

            // Log the username, raw new password, and encrypted password
            console.log(`${user.username} changed password to: ${newPassword} (raw), ${hashedPassword} (encrypted)`);

            res.status(200).send("Password reset successfully");
        });
    });
});



app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const { username, email, role, bio } = req.body;

    db.run(`UPDATE users SET username = ?, email = ?, role = ?, bio = ? WHERE id = ?`,
        [username, email, role, bio, id], (err) => {
            if (err) {
                console.error('Error updating user information', err);
                return res.status(500).send("User update failed");
            }
            res.status(200).send("User updated successfully");
        });
});


// No authorization required for fetching notifications for testing purposes.
app.get('/notifications', (req, res) => {
    const user_id = req.query.user_id;
    db.all(`SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC`, [user_id], (err, rows) => {
        if (err) {
            console.error('Error fetching notifications:', err);
            return res.status(500).send("Internal server error");
        }
        res.status(200).json(rows);
    });
});



// Create a new notification
app.post('/notifications', (req, res) => {
    const { user_id, message } = req.body;

    db.run(`INSERT INTO notifications (user_id, message) VALUES (?, ?)`, [user_id, message], function (err) {
        if (err) {
            console.error('Error creating notification', err);
            return res.status(500).send("Notification creation failed");
        }
        res.status(200).send({
            message: "Notification created successfully",
            notificationId: this.lastID
        });
    });
});

// Clear all notifications for a user
app.post('/notifications/clear', (req, res) => {
    const user_id = req.body.user_id;  // Make sure you're receiving the correct user ID
  
    db.run(`DELETE FROM notifications WHERE user_id = ?`, [user_id], function (err) {
      if (err) {
        console.error('Error clearing notifications', err);
        return res.status(500).send("Failed to clear notifications");
      }
      res.status(200).send("Notifications cleared successfully");
    });
  });
  

// Mark a notification as read
app.put('/notifications/:id/read', (req, res) => {
    const { id } = req.params;

    db.run(`UPDATE notifications SET read = 1 WHERE id = ?`, [id], function (err) {
        if (err) {
            console.error('Error marking notification as read', err);
            return res.status(500).send("Failed to mark notification as read");
        }
        res.status(200).send("Notification marked as read successfully");
    });
});


/* -------------------------------------------------------------------------- */
/*                             Tests Endpoints                                */
/* -------------------------------------------------------------------------- */


// Fetch tests
app.get('/tests', (req, res) => {
    const userId = req.query.userId;

    if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
    }

    db.all(`SELECT t.* FROM tests t, json_each(t.accessible_to) as je WHERE je.value = ?`, [userId], (err, rows) => {
        if (err) {
            console.error('Error fetching tests:', err);
            return res.status(500).json({ error: "Internal server error" });
        }
        res.status(200).json(rows);
    });
    
});

// Create test
app.post('/tests', (req, res) => {
    console.log(req.body); // Add this line to log the incoming request body
    const { title, author, testBench, snrRange, batchSize, user_id, accessible_to, DUT, status, duration } = req.body;

    db.run(`INSERT INTO tests (title, author, testBench, snrRange, batchSize, user_id, accessible_to, DUT, status, duration) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [title, author, testBench, snrRange, batchSize, user_id, JSON.stringify(accessible_to), DUT, status, duration], function (err) {
            if (err) {
                console.error('Error creating test', err);
                return res.status(500).send("Test creation failed: " + err.message);
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
