import os
import time
import logging
import sqlite3
from flask import Flask, request, jsonify
from flask_cors import CORS
# import serial  # Commented out for now

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configuration
# COM_PORT = os.getenv('COM_PORT', '/dev/tty.usbmodem14101')  # Adjust for macOS
# BAUD_RATE = int(os.getenv('BAUD_RATE', '9600'))
# TIMEOUT = int(os.getenv('TIMEOUT', '1'))

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize serial connection
# def init_serial_connection(port, baud_rate, timeout):
#     try:
#         ser = serial.Serial(port, baud_rate, timeout=timeout)
#         logger.info(f"Opened serial port {port} successfully.")
#         return ser
#     except serial.SerialException as e:
#         logger.error(f"Could not open port {port}: {e}")
#         return None

# ser = init_serial_connection(COM_PORT, BAUD_RATE, TIMEOUT)

# Database setup
DATABASE = 'data.db'

def init_db():
    conn = sqlite3.connect(DATABASE)
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

init_db()

@app.route('/send', methods=['POST'])
def send_message():
    # if not ser:
    #     return jsonify({"status": "failure", "error": "Serial connection not initialized"}), 500

    try:
        data = request.get_json()
        logger.info(f"Received data: {data}")
        required_fields = ['uuid', 'userName', 'chip', 'numTests', 'date', 'startTime', 'status']
        
        if not all(field in data for field in required_fields):
            logger.error("Invalid input data")
            return jsonify({"status": "failure", "error": "Invalid input data"}), 400

        uuid = data['uuid']
        user_name = data['userName']
        chip = data['chip']
        snr = data.get('snr', None)  # snr can be None if not provided
        num_tests = data['numTests']
        date = data['date']
        start_time = data['startTime']
        end_time = data.get('endTime', '-')
        status = data['status']
        
        logger.info(f"Inserting into database: {uuid}, {user_name}, {chip}, {snr}, {num_tests}, {date}, {start_time}, {end_time}, {status}")
        
        conn = sqlite3.connect(DATABASE)
        c = conn.cursor()
        c.execute('''
            INSERT INTO tests (id, user_name, chip, snr, num_tests, date, start_time, end_time, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (uuid, user_name, chip, snr, num_tests, date, start_time, end_time, status))
        conn.commit()
        conn.close()

        # x = data['x']
        # y = data['y']
        # message = f"{x} {y}\n"

        # Send the message to the Teensy
        # ser.write(message.encode())
        # logger.info(f"Sent message to Teensy: {message.strip()}")

        # Read the response from the Teensy
        # time.sleep(1)  # Adjust based on your Teensy's response time
        # response = ser.readline().decode().strip()
        # logger.info(f"Received response from Teensy: {response}")

        # if response:
        #     return jsonify({"status": "success", "response": response})
        # else:
        #     return jsonify({"status": "failure", "error": "No response from Teensy"})
        
        # Since we're skipping the hardware part, return a success response directly
        return jsonify({"status": "success", "response": "Simulated response from Teensy"})
    except Exception as e:
        logger.error(f"Error in /send route: {e}")
        return jsonify({"status": "failure", "error": str(e)}), 500

@app.route('/status', methods=['GET'])
def check_status():
    # if ser and ser.is_open:
    #     return jsonify({"status": "success", "message": "Test bench is online"})
    # else:
        return jsonify({"status": "success", "message": "Test bench is online"})

@app.route('/tests/<user_name>', methods=['GET'])
def get_user_tests(user_name):
    conn = sqlite3.connect(DATABASE)
    c = conn.cursor()
    c.execute('''
        SELECT * FROM tests WHERE user_name = ?
    ''', (user_name,))
    tests = c.fetchall()
    conn.close()

    return jsonify({"status": "success", "tests": tests})

@app.route('/tests', methods=['GET'])
def get_all_tests():
    conn = sqlite3.connect(DATABASE)
    c = conn.cursor()
    c.execute('SELECT * FROM tests')
    tests = c.fetchall()
    conn.close()

    # Map results to a list of dictionaries
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

@app.route('/tests/<id>', methods=['DELETE'])
def delete_test(id):
    try:
        conn = sqlite3.connect(DATABASE)
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
