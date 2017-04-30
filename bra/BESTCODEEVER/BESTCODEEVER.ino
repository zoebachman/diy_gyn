/*********************************************************************
 This is an example for our nRF51822 based Bluefruit LE modules

 Pick one up today in the adafruit shop!

 Adafruit invests time and resources providing this open source code,
 please support Adafruit and open-source hardware by purchasing
 products from Adafruit!

 MIT license, check LICENSE for more information
 All text above, and the splash screen below must be included in
 any redistribution
*********************************************************************/

#include <Arduino.h>
#include <SPI.h>
#if not defined (_VARIANT_ARDUINO_DUE_X_) && not defined (_VARIANT_ARDUINO_ZERO_)
#include <SoftwareSerial.h>
#endif

#include "Adafruit_BLE.h"
#include "Adafruit_BluefruitLE_SPI.h"
#include "Adafruit_BluefruitLE_UART.h"

#include "BluefruitConfig.h"

/*=========================================================================
    APPLICATION SETTINGS

    FACTORYRESET_ENABLE       Perform a factory reset when running this sketch
   
                              Enabling this will put your Bluefruit LE module
                              in a 'known good' state and clear any config
                              data set in previous sketches or projects, so
                              running this at least once is a good idea.
   
                              When deploying your project, however, you will
                              want to disable factory reset by setting this
                              value to 0.  If you are making changes to your
                              Bluefruit LE device via AT commands, and those
                              changes aren't persisting across resets, this
                              is the reason why.  Factory reset will erase
                              the non-volatile memory where config data is
                              stored, setting it back to factory default
                              values.
       
                              Some sketches that require you to bond to a
                              central device (HID mouse, keyboard, etc.)
                              won't work at all with this feature enabled
                              since the factory reset will clear all of the
                              bonding data stored on the chip, meaning the
                              central device won't be able to reconnect.
    MINIMUM_FIRMWARE_VERSION  Minimum firmware version to have some new features
    MODE_LED_BEHAVIOUR        LED activity, valid options are
                              "DISABLE" or "MODE" or "BLEUART" or
                              "HWUART"  or "SPI"  or "MANUAL"
    -----------------------------------------------------------------------*/
#define FACTORYRESET_ENABLE         1
#define MINIMUM_FIRMWARE_VERSION    "0.6.6"
#define MODE_LED_BEHAVIOUR          "MODE"
/*=========================================================================*/


/* ...or hardware serial, which does not need the RTS/CTS pins. Uncomment this line */
Adafruit_BluefruitLE_UART ble(BLUEFRUIT_HWSERIAL_NAME, BLUEFRUIT_UART_MODE_PIN);

// A small helper
void error(const __FlashStringHelper*err) {
  Serial.println(err);
  while (1);
}

/**************************************************************************/
/*!
    @brief  Sets up the HW an the BLE module (this function is called
            automatically on startup)
*/
/**************************************************************************/

int sensorValue[12]; // an array to store the sensor values

#define firstAddressPin 2

int myPins[] = {2, 3, 9, 10}; // digital output pins on FLORA

int i; //for for loop to go through pin array

const int analogInPin = A11; //sensor pin

void setup(void)
{
  while (!Serial);  // required for Flora & Micro
  delay(500);

  //???
  Serial.begin(115200);
  Serial.println(F("Adafruit Bluefruit Command <-> Data Mode Example"));
  Serial.println(F("------------------------------------------------"));

  /* Initialise the module */
  Serial.print(F("Initialising the Bluefruit LE module: "));

  if ( !ble.begin(VERBOSE_MODE) )
  {
    error(F("Couldn't find Bluefruit, make sure it's in CoMmanD mode & check wiring?"));
  }
  Serial.println( F("OK!") );

  if ( FACTORYRESET_ENABLE )
  {
    /* Perform a factory reset to make sure everything is in a known state */
    Serial.println(F("Performing a factory reset: "));
    if ( ! ble.factoryReset() ) {
      error(F("Couldn't factory reset"));
    }
  }

  /* Disable command echo from Bluefruit */
  ble.echo(false);

  Serial.println("Requesting Bluefruit info:");
  /* Print Bluefruit information */
  ble.info();

  Serial.println(F("Please use Adafruit Bluefruit LE app to connect in UART mode"));
  Serial.println(F("Then Enter characters to send to Bluefruit"));
  Serial.println();

  ble.verbose(false);  // debug info is a little annoying after this point!

  /* Wait for connection */
  while (! ble.isConnected()) {
    delay(500);
  }

  Serial.println(F("******************************"));

  // LED Activity command is only supported from 0.6.6
  if ( ble.isVersionAtLeast(MINIMUM_FIRMWARE_VERSION) )
  {
    // Change Mode LED Activity
    Serial.println(F("Change LED activity to " MODE_LED_BEHAVIOUR));
    ble.sendCommandCheckOK("AT+HWModeLED=" MODE_LED_BEHAVIOUR);
  }

  // Set module to DATA mode
  Serial.println( F("Switching to DATA mode!") );
  ble.setMode(BLUEFRUIT_MODE_DATA);

  Serial.println(F("******************************"));
}

/**************************************************************************/
/*!
    @brief  Constantly poll for new command or response data
*/
/**************************************************************************/
void loop(void)
{

  //this following code works
  for (i = 0; i < 4; i = i + 1) {
    //  Serial.println(myPins[i]);
    //  pinMode(myPins[i], OUTPUT);
    int pinNumber = myPins[i];
    //    Serial.println(pinNumber);
  }

  // Check for user input
  //  int sensorValue = analogRead(analogInPin); //reading the FSR

  if (Serial.available())
  {

    //   Serial.read(sensorValue);

    // Send characters to Bluefruit
    //    Serial.print("Sending: ");

    // iterate once for every multiplexer (called muxes for short):
    for (int mux = 0; mux < 1; mux++) {
      for (int channelNum = 0; channelNum < 12; channelNum ++) {
        // determine the four address pin values from the channelNum:
        setChannel(channelNum);

        // read the analog input and store it in the value array:
        sensorValue[channelNum] = analogRead(analogInPin + mux);
        //sensorValue[channelNum] = analogRead(analogInput + mux);
        delay(10);
        // print the values as a single tab-separated line:
        //        Serial.print(sensorValue[channelNum], DEC);
        Serial.println(sensorValue[channelNum], DEC);
//        Serial.print(",");
        delay(100);

        ble.println(sensorValue[channelNum]); //take this out next if it doesn't work
        delay(100);
      }
    }

    //    Serial.println(sensorValue);
    //    delay(2000);

    // Send input data to host via Bluefruit
    //  ble.println(sensorValue); //take this out next if it doesn't work
    //   delay(2000);

  }

  // Echo received data
  //  while ( ble.available() )
  //  {
  //    int c = ble.read();
  //
  ////    int sensorReading = ble.read();
  //
  //    Serial.print((char)c);
  ////    Serial.println((char)c);
  ////    Serial.print(sensorReading);
  //
  //
  //    // Hex output too, helps w/debugging!
  //    Serial.print(" [0x");
  //    if (c <= 0xF) Serial.print(F("0"));
  //    Serial.print(c, HEX);
  //    Serial.print("] ");
  //  }
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
