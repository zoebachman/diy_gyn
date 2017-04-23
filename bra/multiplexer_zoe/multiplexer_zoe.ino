int sensorValue[16];  // an array to store the sensor values

// the address pins will go in order from the first one:
#define firstAddressPin 8

int analogInput = 0;

void setup() {
  Serial.begin(9600);
  // set the output pins:
  for (int pinNumber = firstAddressPin; pinNumber < firstAddressPin + 4; pinNumber++) {
    pinMode(pinNumber, OUTPUT);
  }
}

void loop() {
  // iterate once for every multiplexer (called muxes for short):
  for (int mux = 0; mux < 1; mux++) {
    for (int channelNum = 0; channelNum < 5; channelNum ++) {
      // determine the four address pin values from the channelNum:
      setChannel(channelNum);

      // read the analog input and store it in the value array: 
      sensorValue[channelNum] = analogRead(analogInput+mux);
      delay(10);
      // print the values as a single tab-separated line:
      Serial.print(sensorValue[channelNum], DEC);
      Serial.print(",");
    }
  }
  // print a carriage return at the end of each read of the mux:
  Serial.println();   
}

void setChannel(int whichChannel) {
  for (int bitPosition = 0; bitPosition < 4; bitPosition++) {
    // shift value x bits to the right, and mask all but bit 0:
    int bitValue = (whichChannel >> bitPosition) & 1;
    // set the address pins:
    int pinNumber = firstAddressPin + bitPosition;
    digitalWrite(pinNumber, bitValue);
  }
}

