
/*
Noble Bluetooth LE scanner
context: node.js
*/

// include libraries:
var noble = require('noble');
var device;                   // the peripheral to which you're connecting
// var timeCharacteristic = '1cbffaa8b17e11e680f576304dec7eb7';   // uuid for the characteristic [only one or two like below?]


// this is Nordic's UART service and it's the same for all! 
var bluefruit = {
    serviceUUID: '6e400001-b5a3-f393-e0a9-e50e24dcca9e', //the same for mine! 
    txCharacteristic: '6e400002-b5a3-f393-e0a9-e50e24dcca9e', // transmit is from the phone's perspective
    rxCharacteristic: '6e400003-b5a3-f393-e0a9-e50e24dcca9e'  // receive is from the phone's perspective
};


// console.log(bluefruit.serviceUUID);

//  callback function for noble stateChange event:
function scanForPeripherals(state){
  if (state === 'poweredOn') {                // if the Bluetooth radio's on,
    // noble.startScanning(['1cbffaa8b17d11e680f576304dec7eb7'], false); // scan for service
    noble.startScanning([bluefruit.serviceUUID], false); // scan for service
    console.log("Started scanning");
  } else {                                    // if the radio's off,
    console.log("Bluetooth radio not responding. Ending program.");
    process.exit(0);                          // end the program
  }
}

// callback function for noble discover event:
function readPeripheral (peripheral) {
  device = peripheral;    // save the peripheral to a global variable

  console.log('discovered ' + device.advertisement.localName);
  console.log('signal strength: ' + device.rssi);
  console.log('device address: ' + device.address);

  noble.stopScanning();                // stop scanning
  device.connect();                    // attempt to connect to peripheral
  device.on('connect', readServices);  // read services when you connect
}


// the readServices function:
function readServices() {
  // Look for services and characteristics.
  // Call the explore function when you find them:
  device.discoverAllServicesAndCharacteristics(explore);
}

// the service/characteristic explore function:
function explore(error, services, characteristics) {
  console.log("explore");
  // list the services and characteristics found:
  console.log('services: ' + services);
  console.log('characteristics: ' + characteristics);

  // check if each characteristic's UUID matches the shutter UUID:
  for (c in characteristics) {
    // if the uuid matches, copy the whole characteristic into timeCharacteristic:
    if (characteristics[c].uuid === bluefruit.txCharacteristic){ //would I change this to TX or RX???
      characteristics[c].subscribe();           // subscribe to the characteristic
      characteristics[c].on('data', readData);  // set a listener for it
    }
  }
}

function readData(data) {
  console.log(data.readIntLE());  // read buffer as an int
  // once you've got the data, you probably want to put it in a global
  // to use elsewhere
}

// Scan for peripherals with the camera service UUID:
noble.on('stateChange', scanForPeripherals);
noble.on('discover', readPeripheral);












// not sure how much of this I need
// var app = {
//     initialize: function() {
//         this.bindEvents();
//         detailPage.hidden = true;
//     },
//     bindEvents: function() {
//         document.addEventListener('deviceready', this.onDeviceReady, false);
//         refreshButton.addEventListener('touchstart', this.refreshDeviceList, false);
//         sendButton.addEventListener('click', this.sendData, false);
//         disconnectButton.addEventListener('touchstart', this.disconnect, false);
//         deviceList.addEventListener('touchstart', this.connect, false); // assume not scrolling
//     },
//     onDeviceReady: function() {
//         app.refreshDeviceList();
//     },
//     refreshDeviceList: function() {
//         deviceList.innerHTML = ''; // empties the list
//         if (cordova.platformId === 'android') { // Android filtering is broken
//             ble.scan([], 5, app.onDiscoverDevice, app.onError);
//         } else {
//             ble.scan([bluefruit.serviceUUID], 5, app.onDiscoverDevice, app.onError);
//         }
//     },
//     onDiscoverDevice: function(device) {
//         var listItem = document.createElement('li'),
//             html = '<b>' + device.name + '</b><br/>' +
//                 'RSSI: ' + device.rssi + '&nbsp;|&nbsp;' +
//                 device.id;

//         listItem.dataset.deviceId = device.id;
//         listItem.innerHTML = html;
//         deviceList.appendChild(listItem);
//     },
//     connect: function(e) {
//         var deviceId = e.target.dataset.deviceId,
//             onConnect = function(peripheral) {
//                 app.determineWriteType(peripheral);

//                 // subscribe for incoming data
//                 ble.startNotification(deviceId, bluefruit.serviceUUID, bluefruit.rxCharacteristic, app.onData, app.onError);
//                 sendButton.dataset.deviceId = deviceId;
//                 disconnectButton.dataset.deviceId = deviceId;
//                 resultDiv.innerHTML = "";
//                 app.showDetailPage();
//             };

//         ble.connect(deviceId, onConnect, app.onError);
//     },
//     determineWriteType: function(peripheral) {
//         // Adafruit nRF8001 breakout uses WriteWithoutResponse for the TX characteristic
//         // Newer Bluefruit devices use Write Request for the TX characteristic

//         var characteristic = peripheral.characteristics.filter(function(element) {
//             if (element.characteristic.toLowerCase() === bluefruit.txCharacteristic) {
//                 return element;
//             }
//         })[0];

//         if (characteristic.properties.indexOf('WriteWithoutResponse') > -1) {
//             app.writeWithoutResponse = true;
//         } else {
//             app.writeWithoutResponse = false;
//         }

//     },
//     onData: function(data) { // data received from Arduino
//         console.log(data);
//         resultDiv.innerHTML = resultDiv.innerHTML + "Received: " + bytesToString(data) + "<br/>";
//         resultDiv.scrollTop = resultDiv.scrollHeight;
//     },