const sqlite3 = require('sqlite3').verbose();

// Connect to the SQLite database
const db = new sqlite3.Database('./mydatabase.db');

// Test details
const tests = [
    { title: 'Test 1', author: 'John Doe', DUT: 'Device 1', status: 'Pending', duration: 30, user_id: 1 },
    { title: 'Test 2', author: 'Jane Smith', DUT: 'Device 2', status: 'Completed', duration: 45, user_id: 2 },
    { title: 'Test 3', author: 'Mike Brown', DUT: 'Device 3', status: 'Running', duration: 60, user_id: 1 },
];

// Insert each test into the database
tests.forEach((test) => {
    const sql = `INSERT INTO tests (title, author, DUT, status, duration, user_id) VALUES (?, ?, ?, ?, ?, ?)`;
    db.run(sql, [test.title, test.author, test.DUT, test.status, test.duration, test.user_id], function (err) {
        if (err) {
            return console.error("Test insertion failed:", err.message);
        }
        console.log(`A new test has been inserted with ID ${this.lastID}`);
    });
});

// Close the database connection
db.close((err) => {
    if (err) {
        return console.error("Failed to close the database connection:", err.message);
    }
    console.log('Database connection closed.');
});
