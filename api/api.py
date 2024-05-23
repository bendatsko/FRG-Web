import os
import time
import logging
import sqlite3
import uuid  # Import uuid module
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Database setup
DATA_DATABASE = 'data.db'
USER_DATABASE = 'users.db'

def init_data_db():
    conn = sqlite3.connect(DATA_DATABASE)
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS tests (
            id TEXT PRIMARY KEY,
            user_name TEXT,
            chip TEXT,
            snr REAL,
            num_tests INTEGER,
            date TEXT,
            start_time TEXT,
            end_time TEXT,
            status TEXT
        )
    ''')
    conn.commit()
    conn.close()

def init_user_db():
    conn = sqlite3.connect(USER_DATABASE)
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            name TEXT,
            email TEXT,
            role TEXT,
            last_online TEXT
        )
    ''')
    conn.commit()
    conn.close()

init_data_db()
init_user_db()

@app.route('/adduser', methods=['POST'])
def add_user():
    try:
        data = request.get_json()
        logger.info(f"Received data: {data}")
        required_fields = ['email']
        
        if not all(field in data for field in required_fields):
            logger.error("Invalid input data")
            return jsonify({"status": "failure", "error": "Invalid input data"}), 400

        email = data['email']
        
        conn = sqlite3.connect(USER_DATABASE)
        c = conn.cursor()
        c.execute('''
            INSERT INTO users (id, name, email, role, last_online)
            VALUES (?, ?, ?, ?, ?)
        ''', (str(uuid.uuid4()), "-", email, "Invitee", "-"))
        conn.commit()
        conn.close()

        return jsonify({"status": "success", "message": f"Email '{email}' has been added to the registrar of authorized emails. Users with authorized emails can sign in freely"})
    except Exception as e:
        logger.error(f"Error in /adduser route: {e}")
        return jsonify({"status": "failure", "error": str(e)}), 500


@app.route('/deleteuser/<id>', methods=['DELETE'])
def delete_user(id):
    try:
        conn = sqlite3.connect(USER_DATABASE)
        c = conn.cursor()
        c.execute('DELETE FROM users WHERE id = ?', (id,))
        conn.commit()
        conn.close()
        return jsonify({"status": "success", "message": "User deleted successfully"})
    except Exception as e:
        logger.error(f"Error in /deleteuser/<id> DELETE route: {e}")
        return jsonify({"status": "failure", "error": str(e)}), 500

@app.route('/status', methods=['GET'])
def check_status():
    return jsonify({"status": "success", "message": "Test bench is online"})

@app.route('/tests/<user_name>', methods=['GET'])
def get_user_tests(user_name):
    conn = sqlite3.connect(DATA_DATABASE)
    c = conn.cursor()
    c.execute('''
        SELECT * FROM tests WHERE user_name = ?
    ''', (user_name,))
    tests = c.fetchall()
    conn.close()

    return jsonify({"status": "success", "tests": tests})

@app.route('/tests', methods=['GET'])
def get_all_tests():
    conn = sqlite3.connect(DATA_DATABASE)
    c = conn.cursor()
    c.execute('SELECT * FROM tests')
    tests = c.fetchall()
    conn.close()

    test_list = [
        {
            "id": row[0],
            "user_name": row[1],
            "chip": row[2],
            "snr": row[3],
            "num_tests": row[4],
            "date": row[5],
            "start_time": row[6],
            "end_time": row[7],
            "status": row[8]
        }
        for row in tests
    ]

    return jsonify({"status": "success", "tests": test_list})


@app.route('/users', methods=['GET'])
def get_all_users():
    try:
        conn = sqlite3.connect(USER_DATABASE)
        c = conn.cursor()
        c.execute('SELECT * FROM users')
        users = c.fetchall()
        conn.close()

        user_list = [
            {
                "id": row[0],
                "name": row[1],
                "email": row[2],
                "role": row[3],
                "last_online": row[4]
            }
            for row in users
        ]

        return jsonify({"status": "success", "users": user_list})
    except Exception as e:
        logger.error(f"Error in /users route: {e}")
        return jsonify({"status": "failure", "error": str(e)}), 500


@app.route('/verifyemail', methods=['POST'])
def verify_email():
    email = request.json.get('email')
    conn = sqlite3.connect(USER_DATABASE)
    c = conn.cursor()
    c.execute('SELECT * FROM users WHERE email = ?', (email,))
    user = c.fetchone()
    conn.close()
    if user:
        return jsonify({"status": "success", "authorized": True})
    else:
        return jsonify({"status": "failure", "authorized": False})


@app.route('/tests/<id>', methods=['DELETE'])
def delete_test(id):
    try:
        conn = sqlite3.connect(DATA_DATABASE)
        c = conn.cursor()
        c.execute('DELETE FROM tests WHERE id = ?', (id,))
        conn.commit()
        conn.close()
        return jsonify({"status": "success", "message": "Test deleted successfully"})
    except Exception as e:
        logger.error(f"Error in /tests/<id> DELETE route: {e}")
        return jsonify({"status": "failure", "error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
