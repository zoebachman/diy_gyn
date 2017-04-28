/*
    This node script is a server which is paired with a serial client script 
    which when functioning together relay serial data from a single serial 
    device to multiple clients.
*/
 
 
 
var http = require('http');
var fs = require('fs');
var url =  require('url');
 
 
// function handleIt(req, res) {
//     console.log("The URL is: " + req.url);
 
//     var parsedUrl = url.parse(req.url);
//     console.log("They asked for " + parsedUrl.pathname);
 
//     var path = parsedUrl.pathname;
//     if (path == "/") {
//         path = "index.html";
//     }
 
//     fs.readFile(__dirname + path,
//         function (err, fileContents) {
//             if (err) {
//                 res.writeHead(500);
//                 return res.end('Error loading ' + req.url);
//             }
//             res.writeHead(200);
//             res.end(fileContents);
//         }
//     );  
     
//     console.log("Got a request " + req.url);
// }
 
 
var httpServer = http.createServer(handleIt);
 
httpServer.listen(8080);  
console.log('Server listening on port 8080');
 
var io = require('socket.io').listen(httpServer);
 
// var socketIdA, socketIdB;
 
io.on('connection', 
    function (socket) { 
        console.log("We have a new client: " + socket.id);

     
        socket.on('sensor', function(data) {
            console.log(data);
            io.sockets.emit("sensor", data);
        });
    }
);



var noble = require('noble');
var bluefruit;                   // the peripheral to which you're connecting
var myData;

// this is Nordic's UART service and it's the same for all! 
var bluefruit = {
    serviceUUID: '6e400001b5a3f393e0a9e50e24dcca9e', //the same for mine! 
    txCharacteristic: '6e400002b5a3f393e0a9e50e24dcca9e', // transmit is from the phone's perspective
    rxCharacteristic: '6e400003b5a3f393e0a9e50e24dcca9e'  // receive is from the phone's perspective

};

//BLE connection
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
  //bluefruit.removeListener('disconnect', explore); //eh??

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
      // sendData(myData); // send it? 
    }
  }
}


function readData(data) {
    // console.log("ondata");
  // console.log(data);

     // console.log(parseInt(data));
     // console.log("we have data")


     myData = parseInt(data); //global var to store data, parsing buffer to int
     

//if socket data emission stuff is in here, then I get that warning
}

// function sendData(data){
//   io.sockets.on('sensor', function(data) { //WHAT IS WRONG WITH YOU??
//     // socket.emit.setMaxListeners(0);
//     console.log("I'm sending data")
//     console.log("Sent: 'sensor' " + data); //change to myData?
//     // socket.broadcast.emit('sensor', data);     // Send it to all the other clients
//     io.sockets.emit('sensor', data);
//     // io.to(socket.id).emit('sensor', data);
//   });
// }

// Scan for peripherals with the camera service UUID:
noble.on('stateChange', scanForPeripherals);
noble.on('discover', readPeripheral);
