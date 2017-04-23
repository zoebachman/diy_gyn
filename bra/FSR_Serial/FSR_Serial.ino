const int analogInPin = A10;

int sensorValue = 0;
int mappedSensorValue = 0;

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
}

void loop() {
  // put your main code here, to run repeatedly:
  sensorValue = analogRead(analogInPin);
  mappedSensorValue = map(sensorValue, 860, 1020, 0, 255);
   // print the results to the serial monitor:
  Serial.print("sensor = ");
  Serial.println(mappedSensorValue);
  delay(1000);
}
