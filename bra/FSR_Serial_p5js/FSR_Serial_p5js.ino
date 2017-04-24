const int analogInPin = A0;

//
void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
}

void loop() {
  // put your main code here, to run repeatedly:
  int sensorValue = analogRead(analogInPin);
//  int mappedSensorValue = map(sensorValue, 0, 1023, 0, 255);
   // print the results to the serial monitor:
   Serial.write(sensorValue);
//  Serial.write(mappedSensorValue);
  delay(1);

}
