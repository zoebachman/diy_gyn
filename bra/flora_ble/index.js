
/*
Noble Bluetooth LE scanner
context: node.js
*/

// include libraries:
var noble = require('noble');
var bluefruit;                   // the peripheral to which you're connecting
// var timeCharacteristic = '1cbffaa8b17e11e680f576304dec7eb7';   // uuid for the characteristic [only one or two like below?]


// this is Nordic's UART service and it's the same for all! 
var bluefruit = {
    serviceUUID: '6e400001b5a3f393e0a9e50e24dcca9e', //the same for mine! 
    txCharacteristic: '6e400002b5a3f393e0a9e50e24dcca9e', // transmit is from the phone's perspective
    rxCharacteristic: '6e400003b5a3f393e0a9e50e24dcca9e'  // receive is from the phone's perspective

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
  bluefruit = peripheral;    // save the peripheral to a global variable

  console.log('discovered ' + bluefruit.advertisement.localName);
  console.log('signal strength: ' + bluefruit.rssi);
  console.log('bluefruit address: ' + bluefruit.address);

  noble.stopScanning();                // stop scanning
  bluefruit.connect();                    // attempt to connect to peripheral
  bluefruit.on('connect', readServices);  // read services when you connect
}


// the readServices function:
function readServices() {
  // Look for services and characteristics.
  // Call the explore function when you find them:
  bluefruit.discoverAllServicesAndCharacteristics(explore);
}

// the service/characteristic explore function:
function explore(error, services, characteristics) {
  console.log("explore");
  // list the services and characteristics found:
  console.log('services: ' + services);
  //console.log('characteristics: ' + characteristics);

  // check if each characteristic's UUID matches the shutter UUID:
  for (c in characteristics) {
  
  	console.log(characteristics[9].uuid);
  	console.log('6e400003b5a3f393e0a9e50e24dcca9e');

    // if the uuid matches, copy the whole characteristic into timeCharacteristic:
    if (characteristics[c].uuid == '6e400003b5a3f393e0a9e50e24dcca9e'){ //would I change this to TX or RX???
    	console.log("uuid matches");
      characteristics[c].subscribe();    
      console.log("subscribed");       // subscribe to the characteristic
      characteristics[c].on('data', readData);  // set a listener for it
    }
  }
}

function readData(data) {
	console.log("ondata");
  console.log(data);  // read buffer as an int
  socket.emit('data',data);
  //console.log(data);
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
//         document.addEventListener('bluefruitready', this.onbluefruitReady, false);
//         refreshButton.addEventListener('touchstart', this.refreshbluefruitList, false);
//         sendButton.addEventListener('click', this.sendData, false);
//         disconnectButton.addEventListener('touchstart', this.disconnect, false);
//         bluefruitList.addEventListener('touchstart', this.connect, false); // assume not scrolling
//     },
//     onbluefruitReady: function() {
//         app.refreshbluefruitList();
//     },
//     refreshbluefruitList: function() {
//         bluefruitList.innerHTML = ''; // empties the list
//         if (cordova.platformId === 'android') { // Android filtering is broken
//             ble.scan([], 5, app.onDiscoverbluefruit, app.onError);
//         } else {
//             ble.scan([bluefruit.serviceUUID], 5, app.onDiscoverbluefruit, app.onError);
//         }
//     },
//     onDiscoverbluefruit: function(bluefruit) {
//         var listItem = document.createElement('li'),
//             html = '<b>' + bluefruit.name + '</b><br/>' +
//                 'RSSI: ' + bluefruit.rssi + '&nbsp;|&nbsp;' +
//                 bluefruit.id;

//         listItem.dataset.bluefruitId = bluefruit.id;
//         listItem.innerHTML = html;
//         bluefruitList.appendChild(listItem);
//     },
//     connect: function(e) {
//         var bluefruitId = e.target.dataset.bluefruitId,
//             onConnect = function(peripheral) {
//                 app.determineWriteType(peripheral);

//                 // subscribe for incoming data
//                 ble.startNotification(bluefruitId, bluefruit.serviceUUID, bluefruit.rxCharacteristic, app.onData, app.onError);
//                 sendButton.dataset.bluefruitId = bluefruitId;
//                 disconnectButton.dataset.bluefruitId = bluefruitId;
//                 resultDiv.innerHTML = "";
//                 app.showDetailPage();
//             };

//         ble.connect(bluefruitId, onConnect, app.onError);
//     },
//     determineWriteType: function(peripheral) {
//         // Adafruit nRF8001 breakout uses WriteWithoutResponse for the TX characteristic
//         // Newer Bluefruit bluefruits use Write Request for the TX characteristic

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