#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>

const char *ssid = "AB7";
const char *password = "07070707";
const char *serverUrl = "https://hard2soft.onrender.com/data";
const int trigPin = 12;
const int echoPin = 14;

// Define sound velocity in cm/uS
#define SOUND_VELOCITY 0.034
#define CM_TO_INCH 0.393701

long duration;
float distanceCm;
float distanceInch;

void setup() {
  Serial.begin(115200);
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }

  Serial.println("Connected to WiFi");
}

void loop() {
  // Clears the trigPin
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);

  // Sets the trigPin on HIGH state for 10 microseconds
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  // Reads the echoPin, returns the sound wave travel time in microseconds
  duration = pulseIn(echoPin, HIGH);

  // Calculate the distance
  distanceCm = duration * SOUND_VELOCITY / 2;

  // Convert to inches
  distanceInch = distanceCm * CM_TO_INCH;

  // Prints the distance on the Serial Monitor
  Serial.print("Distance (cm): ");
  Serial.println(distanceCm);
  Serial.print("Distance (inch): ");
  Serial.println(distanceInch);

  // Send data to Node.js server
  HTTPClient http;
  String dataToSend = "{\"distanceCm\": " + String(distanceCm) + ", \"distanceInch\": " + String(distanceInch) + "}";

  WiFiClient wifiClient;  // Create a WiFiClient object
  http.begin(wifiClient, serverUrl);
  http.addHeader("Content-Type", "application/json");

  int httpResponseCode = http.POST(dataToSend);

  if (httpResponseCode > 0) {
    Serial.print("HTTP Response code: ");
    Serial.println(httpResponseCode);
  } else {
    Serial.println("Error on sending data");
  }

  http.end();

  delay(300); // Delay for 300 milliseconds before the next iteration
}
