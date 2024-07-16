#include <Arduino.h>
#include <ArduinoJson.h>

bool initialSetupDone = false;

void setup() {
  Serial.begin(9600);
  // Wait for serial port to connect, or timeout after 5 seconds
  unsigned long startTime = millis();
  while (!Serial && millis() - startTime < 5000) {
    ; // wait for serial port to connect
  }
}

void runSimpleTest(int testId) {
  Serial.println("{\"status\":\"started\",\"testId\":" + String(testId) + "}");
  Serial.flush();
  
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

  Serial.println("{\"status\":\"completed\",\"testId\":" + String(testId) + "}");
  Serial.flush();
}

void loop() {
  if (!initialSetupDone) {
    Serial.println("Teensy is ready for testing!");
    Serial.println("Firmware version: 1.0");
    Serial.flush();
    initialSetupDone = true;
  }

  // Visual indicator that Teensy is waiting for input
  static unsigned long lastBlink = 0;
  if (millis() - lastBlink > 1000) {
    Serial.print(".");
    Serial.flush();
    lastBlink = millis();
  }

  if (Serial.available()) {
    String command = Serial.readStringUntil('\n');
    command.trim();
    
    Serial.println("\nReceived command: " + command);
    Serial.flush();
    
    if (command.startsWith("TEST")) {
      int testId = command.substring(4).toInt();
      if (testId > 0) {
        Serial.println("Running test with ID: " + String(testId));
        Serial.flush();
        runSimpleTest(testId);
      } else {
        Serial.println("Invalid test ID");
        Serial.flush();
      }
    } else {
      Serial.println("Unknown command. Use 'TEST<id>' to run a test.");
      Serial.flush();
    }
  }
}