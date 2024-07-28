const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');
const {v4: uuidv4} = require('uuid');
const fs = require('fs');
const fsp = fs.promises;  // Use this for promise-based functions
const path = require('path');



const TESTS_FOLDER = path.join(__dirname, 'tests');


const {SerialPort} = require('serialport');
const {ReadlineParser} = require('@serialport/parser-readline');

const app = express();
const PORT = process.env.PORT || 3001;
const SECRET_KEY = "your_secret_key";

app.use(bodyParser.json());
app.use(cors());

// Global queue for tests
const testQueue = [];
let isProcessingQueue = false;

// Serial port setup
const port = new SerialPort({
    path: '/dev/ttyACM0', // Update this to match your Teensy's port
    baudRate: 9600
});
const parser = port.pipe(new ReadlineParser({delimiter: '\n'}));
const USE_TEENSY = true; // Set this to true when you're ready to use the actual Teensy
port.on('error', (err) => {
    console.error('Serial port error:', err.message);
});

/* -------------------------------------------------------------------------- */
/*                              Database connect                              */

/* -------------------------------------------------------------------------- */


async function updateTestStatus(testId, status) {
    return new Promise((resolve, reject) => {
        db.run('UPDATE tests SET status = ? WHERE id = ?', [status, testId], (err) => {
            if (err) reject(err);
            else resolve();
        });
    });
}


async function processTestQueue() {
    if (isProcessingQueue || testQueue.length === 0) return;

    isProcessingQueue = true;
    const test = testQueue.shift();

    try {
        console.log(`Processing test:`, JSON.stringify(test, null, 2));

        // Validate test object
        if (!test || !test.id) {
            throw new Error(`Invalid test object: missing id`);
        }
        if (!test.username) {
            console.warn(`Warning: username is missing for test ${test.id}`);
            // You might want to fetch the username from the database here
            // For now, we'll use a placeholder
            test.username = 'unknown_user';
        }

        await updateTestStatus(test.id, 'Running');

        // Save test configuration
        const configPath = await saveTestConfig(test.username, test.id, {
            snrRange: test.snrRange,
            batchSize: test.batchSize,
            // Add other test parameters here
        });

        // Create results stream
        const resultsStream = await createResultsStream(test.username, test.id);

        // Write CSV header
        resultsStream.write('iteration,snr,ber,fer\n');

        // Run test on Teensy
        const results = await runTestOnTeensy(test, resultsStream);

        // Close the results stream
        resultsStream.end();

        // Update test with results file path
        await updateTestWithResults(test.id, resultsStream.path);

        console.log(`Test ID ${test.id} completed successfully`);
        await updateTestStatus(test.id, 'Completed');
    } catch (error) {
        console.error(`Error processing test ID ${test.id}:`, error);
        await updateTestStatus(test.id, 'Failed');
    } finally {
        isProcessingQueue = false;
        processTestQueue(); // Process next test in queue
    }
}


// Function to update test with results file path
async function updateTestWithResults(testId, resultsFilePath) {
    return new Promise((resolve, reject) => {
        db.run('UPDATE tests SET results_file = ?, status = ? WHERE id = ?',
            [resultsFilePath, 'Completed', testId],
            (err) => {
                if (err) reject(err);
                else resolve();
            });
    });
}

// Connect to SQLite database
const db = new sqlite3.Database('../data.db', (err) => {
    if (err) {
        console.error('Could not connect to database', err);
    } else {
        console.log('Connected to database');
    }
});

// Function to safely execute SQL statements
function safeDbRun(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
            if (err) {
                console.error(`Error executing SQL: ${sql}`, err);
                reject(err);
            } else {
                resolve(this);
            }
        });
    });
}

// Function to check if a column exists in a table
function columnExists(table, column) {
    return new Promise((resolve, reject) => {
        db.all(`PRAGMA table_info(${table})`, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                if (Array.isArray(rows)) {
                    resolve(rows.some(row => row.name === column));
                } else if (typeof rows === 'object' && rows !== null) {
                    // If rows is an object, check if any of its properties match the column name
                    resolve(Object.values(rows).some(row => row.name === column));
                } else {
                    console.error('Unexpected result from PRAGMA table_info:', rows);
                    resolve(false);
                }
            }
        });
    });
}

// SERIALIZE DATABASE
db.serialize(async () => {
    try {
        // Check if uuid column exists in users table
        const uuidExists = await columnExists('users', 'uuid');
        if (!uuidExists) {
            await safeDbRun("ALTER TABLE users ADD COLUMN uuid TEXT");
            console.log("Added uuid column to users table");
        }

        // Update users without UUID
        db.each("SELECT id FROM users WHERE uuid IS NULL OR uuid = ''", async (err, row) => {
            if (err) {
                console.error("Error fetching users without uuid:", err);
                return;
            }

            const newUuid = uuidv4();
            try {
                await safeDbRun("UPDATE users SET uuid = ? WHERE id = ?", [newUuid, row.id]);
                console.log(`User with id ${row.id} updated with uuid ${newUuid}`);
            } catch (err) {
                console.error("Error updating user with uuid:", err);
            }
        });

        // Create tests table if it doesn't exist
        await safeDbRun(`CREATE TABLE IF NOT EXISTS tests (
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

        // Check if threshold and results columns exist in tests table
        const thresholdExists = await columnExists('tests', 'threshold');
        const resultsExists = await columnExists('tests', 'results');

        if (!thresholdExists) {
            await safeDbRun("ALTER TABLE tests ADD COLUMN threshold REAL DEFAULT 0.5");
            console.log("Added threshold column to tests table");
        }
        if (!resultsExists) {
            await safeDbRun("ALTER TABLE tests ADD COLUMN results TEXT DEFAULT '[]'");
            console.log("Added results column to tests table");
        }

        // Create notifications table if it doesn't exist
        await safeDbRun(`CREATE TABLE IF NOT EXISTS notifications (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            message TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            read BOOLEAN DEFAULT 0,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )`);


                // Add results_file column to tests table
                const resultsFileExists = await columnExists('tests', 'results_file');
                if (!resultsFileExists) {
                    await safeDbRun("ALTER TABLE tests ADD COLUMN results_file TEXT");
                    console.log("Added results_file column to tests table");
                }

                

        console.log('Database schema updated successfully');
    } catch (error) {
        console.error('Error updating database schema:', error);
    }
});


// Updated helper functions
async function ensureUserFolder(username) {
    if (!username) {
        throw new Error('Username is required to create user folder');
    }
    const userFolder = path.join(TESTS_FOLDER, username);
    await fsp.mkdir(userFolder, { recursive: true });
    return userFolder;
}


async function saveTestConfig(username, testId, config) {
    if (!username || !testId) {
        throw new Error('Username and testId are required to save test configuration');
    }
    const userFolder = await ensureUserFolder(username);
    const configPath = path.join(userFolder, `config_${testId}.json`);
    await fsp.writeFile(configPath, JSON.stringify(config, null, 2)); // Ensure using fsp.writeFile
    return configPath;
}

async function createResultsStream(username, testId) {
    if (!username || !testId) {
        throw new Error('Username and testId are required to create results stream');
    }
    const userFolder = await ensureUserFolder(username);
    const resultsPath = path.join(userFolder, `results_${testId}.csv`);
    return fs.createWriteStream(resultsPath);
}


/* -------------------------------------------------------------------------- */
/*                              Authentication                                */
/* -------------------------------------------------------------------------- */

// Register
app.post('/register', (req, res) => {
    const {email, password, username, bio, role} = req.body;
    const hashedPassword = bcrypt.hashSync(password, 8);
    const uuid = uuidv4();

    db.run(`INSERT INTO users (email, password, username, bio, uuid, role) VALUES (?, ?, ?, ?, ?, ?)`,
        [email, hashedPassword, username, bio, uuid, role], function (err) {
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
    const {id} = req.params;
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
    const {id} = req.params;
    const {username, email, role, bio} = req.body;

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
    const {id} = req.params;

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

    db.get(`SELECT id, username, email, uuid, role, bio FROM users WHERE uuid = ?`, [uuid], (err, user) => {
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

// Password reset
app.post('/reset-password', (req, res) => {
    const {userId, newPassword} = req.body;

    db.get(`SELECT * FROM users WHERE id = ?`, [userId], (err, user) => {
        if (err) {
            console.error('Error fetching user information', err);
            return res.status(500).send("Internal server error");
        }
        if (!user) {
            return res.status(404).send("User not found");
        }

        const hashedPassword = bcrypt.hashSync(newPassword, 8);

        db.run(`UPDATE users SET password = ? WHERE id = ?`, [hashedPassword, userId], function (err) {
            if (err) {
                console.error('Error resetting password', err);
                return res.status(500).send("Password reset failed");
            }
            res.status(200).send("Password reset successfully");
        });
    });
});

/* -------------------------------------------------------------------------- */
/*                           Notification endpoints                           */
/* -------------------------------------------------------------------------- */

// Fetch notifications
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
    const {user_id, message} = req.body;

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
    const user_id = req.body.user_id;

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
    const {id} = req.params;

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
    const username = req.query.username;

    if (!username) {
        return res.status(400).json({error: "Username is required"});
    }

    db.all(`SELECT * FROM tests WHERE JSON_EXTRACT(accessible_to, '$') LIKE ?`, [`%${username}%`], (err, rows) => {
        if (err) {
            console.error('Error fetching tests:', err);
            return res.status(500).json({error: "Internal server error"});
        }
        res.status(200).json(rows);
    });
});

app.post('/tests', async (req, res) => {
    const {title, author, testBench, snrRange, batchSize, username, accessible_to, DUT, status, duration} = req.body;

    try {
        const testId = await new Promise((resolve, reject) => {
            db.run(`INSERT INTO tests (title, author, testBench, snrRange, batchSize, username, accessible_to, DUT, status, duration) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [title, author, testBench, snrRange, batchSize, username, JSON.stringify(accessible_to), DUT, 'Queued', duration],
                function (err) {
                    if (err) reject(err);
                    else resolve(this.lastID);
                });
        });

        console.log(`Test created with ID: ${testId}`);

        // Add test to queue with all necessary information
        testQueue.push({id: testId, snrRange, batchSize, username});
        console.log(`Added to queue: ${JSON.stringify({id: testId, snrRange, batchSize, username})}`);
        
        processTestQueue(); // Try to process queue (will only proceed if no test is running)

        res.status(200).send({
            message: "Test created and queued successfully",
            testId: testId
        });
    } catch (error) {
        console.error('Error creating test:', error);
        res.status(500).send("Test creation failed: " + error.message);
    }
});


function runTestOnTeensy(testParams, resultsStream) {
    return new Promise((resolve, reject) => {
        if (!testParams || !testParams.id || !testParams.snrRange || !testParams.batchSize) {
            reject(new Error(`Invalid test parameters: ${JSON.stringify(testParams)}`));
            return;
        }

        console.log('Sending test parameters to Teensy:', testParams);
        port.write(`TEST${testParams.id} ${testParams.snrRange} ${testParams.batchSize}\n`, (err) => {
            if (err) {
                console.error('Error writing to serial port:', err);
                reject(err);
            } else {
                console.log('Test parameters sent successfully');
            }
        });

        const dataHandler = (data) => {
            console.log('Received data from Teensy:', data);
            
            if (data.trim().startsWith('{') && data.trim().endsWith('}')) {
                try {
                    const parsedData = JSON.parse(data);
                    if (parsedData.status === "started") {
                        console.log(`Test ${testParams.id} started`);
                    } else if (parsedData.status === "completed") {
                        parser.removeListener('data', dataHandler);
                        console.log(`Test ${testParams.id} completed`);
                        resolve();
                    } else if (parsedData.iteration) {
                        // Write result to CSV file
                        resultsStream.write(`${parsedData.iteration},${parsedData.snr},${parsedData.ber},${parsedData.fer}\n`);
                    }
                } catch (err) {
                    console.error('Error parsing JSON:', err, 'Raw data:', data);
                }
            } else {
                console.log('Non-JSON data from Teensy:', data);
            }
        };

        parser.on('data', dataHandler);

        setTimeout(() => {
            parser.removeListener('data', dataHandler);
            reject(new Error('Test timeout: did not complete in time'));
        }, 30000 * 60); // 30 minute timeout for long-running tests
    });
}

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

// Fetch a single test by ID
app.get('/tests/:id', (req, res) => {
    const {id} = req.params;
    db.get(`SELECT * FROM tests WHERE id = ?`, [id], (err, row) => {
        if (err) {
            console.error('Error fetching test:', err);
            return res.status(500).json({error: "Internal server error"});
        }
        if (!row) {
            return res.status(404).json({error: "Test not found"});
        }
        row.results = JSON.parse(row.results);
        res.status(200).json(row);
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

// Share a test with a user
app.post('/tests/:id/share', (req, res) => {
    const {id} = req.params;
    const {username} = req.body;

    db.get(`SELECT accessible_to FROM tests WHERE id = ?`, [id], (err, row) => {
        if (err) {
            console.error('Error fetching test:', err);
            return res.status(500).send("Internal server error");
        }
        if (!row) {
            return res.status(404).send("Test not found");
        }

        let accessibleTo = JSON.parse(row.accessible_to);
        if (!Array.isArray(accessibleTo)) {
            accessibleTo = [];
        }

        if (!accessibleTo.includes(username)) {
            accessibleTo.push(username);
        }

        db.run(`UPDATE tests SET accessible_to = ? WHERE id = ?`,
            [JSON.stringify(accessibleTo), id], (err) => {
                if (err) {
                    console.error('Error updating test:', err);
                    return res.status(500).send("Failed to share test");
                }
                res.status(200).send("Test shared successfully");
            });
    });
});

// Remove a user's access to a test
app.post('/tests/:id/remove-access', (req, res) => {
    const {id} = req.params;
    const {username} = req.body;

    db.get(`SELECT accessible_to FROM tests WHERE id = ?`, [id], (err, row) => {
        if (err) {
            console.error('Error fetching test:', err);
            return res.status(500).send("Internal server error");
        }
        if (!row) {
            return res.status(404).send("Test not found");
        }

        let accessibleTo = JSON.parse(row.accessible_to);
        if (!Array.isArray(accessibleTo)) {
            accessibleTo = [];
        }

        accessibleTo = accessibleTo.filter(user => user !== username);

        db.run(`UPDATE tests SET accessible_to = ? WHERE id = ?`,
            [JSON.stringify(accessibleTo), id], (err) => {
                if (err) {
                    console.error('Error updating test:', err);
                    return res.status(500).send("Failed to remove access");
                }
                res.status(200).send("Access removed successfully");
            });
    });
});

// Update test threshold
app.put('/tests/:id/threshold', (req, res) => {
    const {id} = req.params;
    const {threshold} = req.body;
    db.run(`UPDATE tests SET threshold = ? WHERE id = ?`, [threshold, id], (err) => {
        if (err) {
            console.error('Error updating threshold:', err);
            return res.status(500).json({error: "Failed to update threshold"});
        }
        res.status(200).json({message: "Threshold updated successfully"});
    });
});

// Rerun test
app.post('/tests/:id/rerun', (req, res) => {
    const {id} = req.params;
    // This is a placeholder for actual test logic
    const newResults = Array(5).fill().map((_, i) => ({
        snr: -5 + i * 2,
        ber: Math.random() * 0.1,
        fer: Math.random() * 0.2
    }));
    db.run(`UPDATE tests SET results = ?, status = ? WHERE id = ?`,
        [JSON.stringify(newResults), 'Completed', id],
        (err) => {
            if (err) {
                console.error('Error rerunning test:', err);
                return res.status(500).json({error: "Failed to rerun test"});
            }
            res.status(200).json({message: "Test rerun successfully", results: newResults});
        }
    );
});

// Download results
app.get('/tests/:id/download', (req, res) => {
    const {id} = req.params;
    db.get(`SELECT title, results_file FROM tests WHERE id = ?`, [id], (err, row) => {
        if (err) {
            console.error('Error fetching test results:', err);
            return res.status(500).json({error: "Failed to fetch test results"});
        }
        if (!row) {
            return res.status(404).json({error: "Test not found"});
        }
        if (!row.results_file) {
            return res.status(404).json({error: "Test results file not found"});
        }

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=${row.title.replace(/\s+/g, '_')}_results.csv`);
        res.sendFile(row.results_file);
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Rest API started. Running on port ${PORT}`);
});