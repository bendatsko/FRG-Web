#include <Arduino.h>
#include <ArduinoJson.h>

bool testMode = false;

void setup() {
  Serial.begin(9600);
  randomSeed(analogRead(0));
}

void runNormalTest(int testId, String snrRange, int batchSize) {
  int snrStart, snrStep, snrStop;
  sscanf(snrRange.c_str(), "%d:%d:%d", &snrStart, &snrStep, &snrStop);

  for (int snr = snrStart; snr <= snrStop; snr += snrStep) {
    for (int batch = 0; batch < batchSize; batch++) {
      float ber = random(0, 100) / 1000.0;
      float fer = random(0, 200) / 1000.0;
      
      DynamicJsonDocument resultDoc(256);
      resultDoc["testId"] = testId;
      resultDoc["snr"] = snr;
      resultDoc["ber"] = ber;
      resultDoc["fer"] = fer;

      String resultJson;
      serializeJson(resultDoc, resultJson);
      Serial.println(resultJson);

      delay(100);
    }
  }
}

void runTestMode(int testId, String snrRange, int batchSize) {
  int snrStart, snrStep, snrStop;
  sscanf(snrRange.c_str(), "%d:%d:%d", &snrStart, &snrStep, &snrStop);

  for (int snr = snrStart; snr <= snrStop; snr += snrStep) {
    for (int batch = 0; batch < batchSize; batch++) {
      float ber = 0.01 * snr; // Example: BER increases linearly with SNR
      float fer = 0.02 * snr; // Example: FER increases linearly with SNR
      
      DynamicJsonDocument resultDoc(256);
      resultDoc["testId"] = testId;
      resultDoc["snr"] = snr;
      resultDoc["ber"] = ber;
      resultDoc["fer"] = fer;

      String resultJson;
      serializeJson(resultDoc, resultJson);
      Serial.println(resultJson);

      delay(100);
    }
  }
}

void loop() {
  if (Serial.available()) {
    String command = Serial.readStringUntil('\n');
    
    if (command == "TEST_MODE_ON") {
      testMode = true;
      Serial.println("Test mode activated");
    } else if (command == "TEST_MODE_OFF") {
      testMode = false;
      Serial.println("Test mode deactivated");
    } else if (command.startsWith("RUN_TEST")) {
      DynamicJsonDocument doc(1024);
      DeserializationError error = deserializeJson(doc, command.substring(9));

      if (error) {
        Serial.println("Failed to parse test parameters");
        return;
      }

      int testId = doc["id"];
      String snrRange = doc["snrRange"].as<String>();
      int batchSize = doc["batchSize"].as<int>();

      if (testMode) {
        runTestMode(testId, snrRange, batchSize);
      } else {
        runNormalTest(testId, snrRange, batchSize);
      }

      Serial.println("{\"status\":\"completed\",\"testId\":" + String(testId) + "}");
    }
  }
}