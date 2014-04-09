var fingerPrintImage = new Image();
var fingerPrint_Layer = new Kinetic.Layer();

function ContentArea(theX, theY, theName, theContent) {

    this.x = theX;
    this.y = theY;
    this.name = theName;

    if (theContent == undefined) {

        this.content = new Array();
    }
    else {
        this.content = theContent;
    }
}

function writeMessage(message) {
	text.setText(message);
	layer.draw();
  }

function createContentArea(mouseLocation) {

    var title = prompt("Please enter the name of the content point:","");

    //Correct to center fingerPrint
    mouseLocation.x = mouseLocation.x - (fingerPrintImage.width / 2);
    mouseLocation.y = mouseLocation.y - (fingerPrintImage.height / 2);

    uploadContentArea();
    placeContentArea(mouseLocation, title);

    console.log("Added content area to map.");
    //window.location.replace("");
}

function uploadContentArea() {

    //TO-DO STUB
    console.log("Uploaded new area to server.");
}

function downloadContentAreas() {

    console.log("Loading fingerprints.");
    fingerPrintImage.src = 'img/fingerprint.png'; //Location of our background

    fingerPrintImage.onload = function() {

	/*fingerPrint.on('mousedown', function() {
	writeMessage('Mousedown fingerprint');
	console.log(fingerPrint.id());
	});

    fingerPrint_Layer.add(fingerPrint);
    */

    stage.add(fingerPrint_Layer);
    };
}

function placeContentArea(theLocation, theID) {

    var fingerPrint = new Kinetic.Image({
		x: theLocation.x,
		y: theLocation.y,
		image: fingerPrintImage,
		id: theID
	});

	fingerPrint.on('mousedown', function() {
	   console.log(fingerPrint.id());
	});

	fingerPrint_Layer.add(fingerPrint);
	fingerPrint_Layer.draw();
}

  var stage = new Kinetic.Stage({
	container: 'container',
	width: 657,
	height: 667,
  });

  //Layer for our background
var background_layer = new Kinetic.Layer();
stage.add(background_layer);

//Canvas background image
var canvasBackgroundImage = new Image();
canvasBackgroundImage.onload = function() {
	var backgroundImage = new Kinetic.Image({
		x: 0,
		y: 0,
		image: canvasBackgroundImage,
		width: 657,
		height: 667
	});

	backgroundImage.on("dblclick dbltap", function() {

	createContentArea(stage.getPointerPosition());
	});

	background_layer.add(backgroundImage);
	background_layer.draw();
};
canvasBackgroundImage.src = 'img/map.png'; //Location of our background

downloadContentAreas();
