
/*
Thanks Sandeep Mistry, Tom Igoe, Jingwen Zhu
*/


// var express = require('express');  //to load express module
// var app = express();  //create an express app
// var http = require('http').Server(app);  //app starts a http server
// var io = require('socket.io')(http);  //require socket.io module


// //express.js part
// app.use(express.static('public'));  //app serves static files inside public folder

// http.listen(8080, function() {
//   console.log('listening on *:8080');  //server listen on port 8080 for connections
// });


//BLE connection
// include libraries:
var noble = require('noble');
var bluefruit;                   // the peripheral to which you're connecting
var myData;

// this is Nordic's UART service and it's the same for all! 
var bluefruit = {
    serviceUUID: '6e400001b5a3f393e0a9e50e24dcca9e', //the same for mine! 
    txCharacteristic: '6e400002b5a3f393e0a9e50e24dcca9e', // transmit is from the phone's perspective
    rxCharacteristic: '6e400003b5a3f393e0a9e50e24dcca9e'  // receive is from the phone's perspective

};


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
  
  	// console.log(characteristics[9].uuid);
  	// console.log('6e400003b5a3f393e0a9e50e24dcca9e');

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
	// console.log("ondata");
  // console.log(data);
  console.log(parseInt(data));

  myData = parseInt(data);
  // console.log(data.readIntLE());  // read buffer as an int
  // socket.emit('data',data);

  // once you've got the data, you probably want to put it in a global
  // to use elsewhere
}

// Scan for peripherals with the camera service UUID:
noble.on('stateChange', scanForPeripherals);
noble.on('discover', readPeripheral);


// //socket.io part
// io.on('connection', function(socket) {

//   console.log("We have a new client: " + socket.id);

//   socket.on('new touch', function(data) {
//     console.log("Received: 'new touch' " + data);
//     socket.broadcast.emit('new touch', data);     // Send it to all the other clients
//   });

//   socket.on('data', function(data) {
//     // var xval = Math.floor((Math.random() * 1000));
//     // var yval = Math.floor((Math.random() * 600));

//     console.log("Received: 'data' " +data);
//     socket.broadcast.emit('new stroke', data)//{
//     //   data: data,
//     //   y: yval,
//     //   h: data,
//     //   r: data
//     // });  // Send it to all the other clients
//   });




//   socket.on('disconnect', function() {
//     console.log("Client has disconnected " + socket.id);
//   });
// });
