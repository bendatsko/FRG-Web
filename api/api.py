import os
import time
import logging
from flask import Flask, request, jsonify
import serial
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configuration
COM_PORT = os.getenv('COM_PORT', 'COM8')
BAUD_RATE = int(os.getenv('BAUD_RATE', '9600'))
TIMEOUT = int(os.getenv('TIMEOUT', '1'))

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize serial connection
def init_serial_connection(port, baud_rate, timeout):
    try:
        ser = serial.Serial(port, baud_rate, timeout=timeout)
        logger.info(f"Opened serial port {port} successfully.")
        return ser
    except serial.SerialException as e:
        logger.error(f"Could not open port {port}: {e}")
        return None

ser = init_serial_connection(COM_PORT, BAUD_RATE, TIMEOUT)

@app.route('/send', methods=['POST'])
def send_message():
    if not ser:
        return jsonify({"status": "failure", "error": "Serial connection not initialized"}), 500

    try:
        data = request.get_json()
        if not data or 'x' not in data or 'y' not in data:
            return jsonify({"status": "failure", "error": "Invalid input data"}), 400

        x = data['x']
        y = data['y']
        message = f"{x} {y}\n"

        # Send the message to the Teensy
        ser.write(message.encode())
        logger.info(f"Sent message to Teensy: {message.strip()}")

        # Read the response from the Teensy
        time.sleep(1)  # Adjust based on your Teensy's response time
        response = ser.readline().decode().strip()
        logger.info(f"Received response from Teensy: {response}")

        if response:
            return jsonify({"status": "success", "response": response})
        else:
            return jsonify({"status": "failure", "error": "No response from Teensy"})
    except Exception as e:
        logger.error(f"Error in /send route: {e}")
        return jsonify({"status": "failure", "error": str(e)}), 500

@app.route('/status', methods=['GET'])
def check_status():
    if ser and ser.is_open:
        return jsonify({"status": "success", "message": "Test bench is online"})
    else:
        return jsonify({"status": "failure", "message": "Test bench is offline"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
