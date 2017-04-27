

//how do I get the socket info in here? 


var socket = io.connect();
// var socket = io.connect('http://localhost:8080/');

socket.on('connect', function() {
  console.log("Connected");
});

//Jingwen's code
// socket.on('new stroke', function(data) {
//   drawStroke(data.x, data.y, data.h, data.r);
// });

socket.on('new touch', function(data) { //***function data from socket server code? 

  graphData(inData); //what arguments does this take? 
});


var inData; //****this is my data where does it goooooo
var xPos=0;


function setup() {
  createCanvas(400, 300);
  background(300, 100, 255, 10);
  }

function draw() {
  fill(255);
  text("sensor value: " + inData, 30, 30);
  //graphData(inData); //***does it go hereeeeeeee
}

function graphData(newData) {
  // map the range of the input to the window height:
  var yPos = map(newData, 0, 255, 0, height);
  // draw the line in a pretty color:
  stroke(0xA8, 0xD9, 0xA7);
  line(xPos, height, xPos, height - yPos);
  // at the edge of the screen, go back to the beginning:
  if (xPos >= width) {
    xPos = 0;
    // clear the screen by resetting the background:
    background(0x08, 0x16, 0x40);
  } else {
    // increment the horizontal position for the next reading:
    xPos++;
  }
}
