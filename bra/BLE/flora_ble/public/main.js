
var socket = io.connect('http://localhost:8080/');



socket.on('connect', function() {
  console.log("Connected");
});



var myData; //****this is my data where does it goooooo
var xPos=0;


function setup() {
  createCanvas(400, 300);
  
}

function draw() {
fill(255);
background(300, 100, 255, 10);

  //graphData(inData); //***does it go hereeeeeeee
    socket.on('sensor', function(data) { //***function data from socket server code? 
      console.log(data);
      text("sensor value: " + data, 30, 30);
      graphData(data); //what arguments does this take?
      });

    // text("sensor value: " + data, 30, 30);
    // graphData(myData); //what arguments does this take?

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
    background(300, 100, 255, 10);
  } else {
    // increment the horizontal position for the next reading:
    xPos++;
  }
}
