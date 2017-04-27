// include libraries:
var noble = require('noble');
// var device;                // the peripheral to which you're connecting, but going to use bluefruit instead


// this is Nordic's UART service and it's the same for all! 
var bluefruit = {
    serviceUUID: '6e400001-b5a3-f393-e0a9-e50e24dcca9e', //the same for mine! 
    txCharacteristic: '6e400002-b5a3-f393-e0a9-e50e24dcca9e', // transmit is from the phone's perspective
    rxCharacteristic: '6e400003-b5a3-f393-e0a9-e50e24dcca9e'  // receive is from the phone's perspective
};

//  callback function for noble stateChange event:
function scanForPeripherals(state){
  if (state === 'poweredOn') {                // if the Bluetooth radio's on,
    // noble.startScanning(['1cbffaa8b17d11e680f576304dec7eb7'], false); // scan for service
    noble.startScanning(['6e400001-b5a3-f393-e0a9-e50e24dcca9e'], false); // scan for service
    console.log("Started scanning");
  } else {                                    // if the radio's off,
    console.log("Bluetooth radio not responding. Ending program.");
    process.exit(0);                          // end the program
  }

  noble.on('read',readPeripheral);
}



//not getting to this second function?

// callback function for noble discover event:
function readPeripheral (peripheral) {
  // bluefruit = peripheral;    // save the peripheral to a global variable

  console.log('discovered ' + bluefruit.advertisement.localName);
  console.log('signal strength: ' + bluefruit.rssi);
  console.log('bluefruit address: ' + bluefruit.address);

 noble.stopScanning();                // stop scanning
  bluefruit.connect();                    // attempt to connect to peripheral
  // bluefruit.discoverServices();
  bluefruit.on('connect', readServices);  // read services when you connect
}


// the readServices function:
function readServices() {
  // Look for services and characteristics.
  // Call the explore function when you find them:
  bluefruit.discoverAllServicesAndCharacteristics(explore);
}


// Scan for peripherals with the camera service UUID:
noble.on('stateChange', scanForPeripherals);
noble.on('discover', readPeripheral);
