#include <Arduino.h>
#include <ArduinoJson.h>

// Constants
const int LED_PIN = 13;
const int BAUD_RATE = 115200;
const int SETUP_TIMEOUT = 5000;  // 5 seconds
const int BLINK_COUNT = 5;
const int BLINK_DELAY = 200;  // milliseconds
const int HEARTBEAT_INTERVAL = 1000;  // milliseconds
const String FIRMWARE_VERSION = "1.0";

// Global variables
bool isSetupComplete = false;
unsigned long lastHeartbeatTime = 0;

void setup() {
    Serial.begin(BAUD_RATE);
    pinMode(LED_PIN, OUTPUT);

    // Wait for serial connection or timeout
    unsigned long startTime = millis();
    while (!Serial && millis() - startTime < SETUP_TIMEOUT) {
        // Wait for serial port to connect
    }
}

void blinkLED(int count, int delayTime) {
    for (int i = 0; i < count; i++) {
        digitalWrite(LED_PIN, HIGH);
        delay(delayTime);
        digitalWrite(LED_PIN, LOW);
        delay(delayTime);
    }
}

void sendJsonMessage(const String& status, int testId) {
    Serial.println("{\"status\":\"" + status + "\",\"testId\":" + String(testId) + "}");
    Serial.flush();
}

void runTest(int testId) {
    sendJsonMessage("started", testId);
    blinkLED(BLINK_COUNT, BLINK_DELAY);

    for (int i = 1; i <= 10; i++) {
        DynamicJsonDocument resultDoc(64);
        resultDoc["testId"] = testId;
        resultDoc["count"] = i;

        String resultJson;
        serializeJson(resultDoc, resultJson);
        Serial.println(resultJson);
        Serial.flush();
        delay(1000);
    }

    sendJsonMessage("completed", testId);
}

void processCommand(const String& command) {
    Serial.println("\nReceived command: " + command);
    Serial.flush();

    if (command.startsWith("TEST")) {
        int testId = command.substring(4).toInt();
        if (testId > 0) {
            Serial.println("Running test with ID: " + String(testId));
            Serial.flush();
            runTest(testId);
        } else {
            Serial.println("Invalid test ID");
            Serial.flush();
        }
    } else {
        Serial.println("Unknown command. Use 'TEST<id>' to run a test.");
        Serial.flush();
    }
}

void sendHeartbeat() {
    unsigned long currentTime = millis();
    if (currentTime - lastHeartbeatTime >= HEARTBEAT_INTERVAL) {
        Serial.print(".");
        Serial.flush();
        lastHeartbeatTime = currentTime;
    }
}

void loop() {
    if (!isSetupComplete) {
        Serial.println("Teensy 4.1 is ready for testing!");
        Serial.println("Firmware version: " + FIRMWARE_VERSION);
        Serial.flush();
        isSetupComplete = true;
    }

    sendHeartbeat();

    if (Serial.available()) {
        String command = Serial.readStringUntil('\n');
        command.trim();
        processCommand(command);
    }
}