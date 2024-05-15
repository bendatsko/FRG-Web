#include <Arduino.h>

void setup()
{
  Serial.begin(9600);
  while (!Serial)
  {
    ; // wait for serial port to connect. Needed for native USB
  }

  Serial.println("Teensy initialized. Waiting for input...");
}

int myFunction(int x, int y)
{
  return x + y; // Example calculation
}

void loop()
{
  if (Serial.available() > 0)
  {
    // Read the incoming message
    String message = Serial.readStringUntil('\n');
    Serial.print("Received message: ");
    Serial.println(message);

    // Parse the message to extract the two integers
    int x, y;
    int paramsParsed = sscanf(message.c_str(), "%d %d", &x, &y);

    if (paramsParsed == 2)
    {
      // Calculate the result
      int result = myFunction(x, y);
      Serial.print("Calculated result: ");
      Serial.println(result);

      // Send the result back to the API
      String response = String(result);
      Serial.println(response);
    }
    else
    {
      String error = "Error: Invalid input format. Expected two integers.";
      Serial.println(error);
    }
  }
}
