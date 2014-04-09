/**
 * @overview This script deals with content point creation.
 <pre>
	var x (x < 1);
 </pre>
 * @name    Content Point
 * @author 	Connor Bain (bainco@email.sc.edu)
 * @version 0.1
 */

/* CONSTANTS */
/** @constant {number} */
var TEXT_BOX = 0;
/** @constant {number} */
var IMAGE_BOX = 1;
/** @constant {number} */
var VIDEO_BOX = 2;
/** @constant {number} */
var AUDIO_BOX = 3;
/** @constant {number} */
var TRANSITION = 4;


/** @constant {number} */
var CP_WIDTH = 824;

/** @constant {number} */
var CP_HEIGHT = 625;

/** @constant {number} */
var DEFAULT_STROKE_WIDTH = 2;


var theBoxes = new Array();
var boxCount = 0;

var currentTool = 0;
var drawing = false;

var currentBox;

function ContentBox(index, inType, inX, inY, inWidth, inHeight) {

    this.type = inType;
    this.x = inX;
    this.y = inY;
    this.width = inWidth;
    this.height = inHeight;
    this.id = index;
    this.data;
}

function drawAll() {

    drawing_layer.removeChildren();
    boxLayer.removeChildren();
    for (var i = 0; i < theBoxes.length; i++) {
        if (theBoxes[i] != null) {
            console.log("Drawing box :" + (i + 1));
            drawContentBox(theBoxes[i]);
        }
    }
    boxLayer.draw();
}

function writeMessage(message) {

    text.setText(message);
	layer.draw();
  }

function handleDraw() {

    if (drawing) {
        console.log("drawing!");
        var mouse = stage.getPointerPosition();

        currentBox.width(mouse.x - currentBox.x());
        currentBox.height(mouse.y - currentBox.y());

        drawing_layer.add(currentBox);
        drawing_layer.draw();
    }
}

function selectTool(selection) {

    currentTool = selection;
    console.log("Current Tool: " + currentTool);
    console.log("Current count: " + boxCount);
}

function finalizeDrawing() {

    var x = Math.round(currentBox.x() / 20) * 20;
    var y = Math.round(currentBox.y() / 20) * 20;

    var width = Math.round(currentBox.width() / 20) * 20;
    var height = Math.round(currentBox.height() / 20) * 20;

    var theBox = new ContentBox(boxCount, currentTool, x, y, width, height);
    currentBox = null;
    theBoxes[boxCount] = theBox;
    boxCount++;
}

function drawContentBox(theContentBox) {

    var color = getBoxColor(theContentBox.type);
    var theText = getBoxText(theContentBox.type);

    var textBox = new Kinetic.Text({
        text: theText,
        fontSize: 18,
        fontFamily: 'Arial',
        align: 'center',
        fill: color
    });


    textBox.x((((theContentBox.x + theContentBox.width) + theContentBox.x) / 2) - (textBox.width() / 2));
    textBox.y((((theContentBox.y + theContentBox.height) + theContentBox.y) / 2) - (textBox.height() / 2));

    var rect = new Kinetic.Rect({
        x: theContentBox.x,
        y: theContentBox.y,
        width: theContentBox.width,
        height: theContentBox.height,
        stroke: color,
        strokeWidth: DEFAULT_STROKE_WIDTH,
        id: theContentBox.id
      });

    rect.on('dblclick', function() {

        console.log("Edit click: " + this.id());
        $("#logo").trigger('click');
        prompt("Enter data");
    });

    rect.on('mousedown',function() {

        selectBox(this);
        console.log(this.id());
    });

    console.log(theContentBox.x);
    boxLayer.add(textBox);
    boxLayer.add(rect);
    boxLayer.draw();
}

function selectBox(theRect) {
    drawing_layer.removeChildren();

    var loadBox = theBoxes[theRect.id()];

    var closeButton = new Kinetic.Image({
        x: loadBox.x - (closeButton_Image.width / 2),
        y: loadBox.y - (closeButton_Image.height / 2),
        image: closeButton_Image
    });

    closeButton.on('mousedown', function() {
        theBoxes[theRect.id()] = null;
        drawing_layer.clear();
        drawAll();
    });

    drawing_layer.add(closeButton);
    drawing_layer.draw();

    /*

    STUB FOR HANDLING DRAGGING

    */

    /*

    STUB FOR HANDLING RESIZE

    var resizeSquare;

    resizeSquare.on('mousedown', function() {

        stage.on('mousemove', function() {


        });
    });
    */
}

var stage = new Kinetic.Stage({
	container: 'container',
	width: CP_WIDTH,
	height: CP_HEIGHT,
  });

  //Layer for our background
var background_layer = new Kinetic.Layer();

background_layer.on('mousedown', function() {

        drawing_layer.removeChildren();

        var mouse = stage.getPointerPosition();

        currentBox = new Kinetic.Rect({
            x: mouse.x,
            y: mouse.y,
            width: 0,
            height: 0,
            strokeWidth: DEFAULT_STROKE_WIDTH
        });

        var color = getBoxColor(currentTool);

        currentBox.stroke(color);

        currentBox.on('mouseup', function() {
            console.log("Mouse up");
            drawing = false;
            finalizeDrawing();
            drawAll();
            stage.on('mousemove', function(){});
            drawing_layer.draw();
        });

        drawing = true;
        stage.on('mousemove', handleDraw);
        console.log("Mouse down");
    });

//Canvas background image
var canvasBackgroundImage = new Image();
canvasBackgroundImage.onload = function() {
	var backgroundImage = new Kinetic.Image({
		x: 0,
		y: 0,
		image: canvasBackgroundImage,
		width: CP_WIDTH,
		height: CP_HEIGHT
	});

	background_layer.add(backgroundImage);
    background_layer.draw();
};
canvasBackgroundImage.src = 'img/cp_background.png'; //Location of our background

var closeButton_Image = new Image();
closeButton_Image.src = 'img/close.png'; //Location of our background

stage.add(background_layer);

var boxLayer = new Kinetic.Layer();
stage.add(boxLayer);
var drawing_layer = new Kinetic.Layer();
stage.add(drawing_layer);

function uploadDesign() {


}

function getBoxColor(theNumber) {

    var color;

    if (theNumber == TEXT_BOX) {
        color = '#6E5E2E';
    }
    else if (theNumber == IMAGE_BOX) {
        color = '#415E45';
    }
    else if (theNumber == VIDEO_BOX) {
        color = '#975823';
    }
    else if (theNumber == AUDIO_BOX) {
        color = '#63220D';
    }
    else if (theNumber == TRANSITION) {
        color = '#211C1C';
    }
    return color;
}

function getBoxText(theNumber) {

    var text;

    if (theNumber == TEXT_BOX) {
        text = 'TEXT';
    }
    else if (theNumber == IMAGE_BOX) {
        text = 'IMAGE';
    }
    else if (theNumber == VIDEO_BOX) {
        text = 'VIDEO';
    }
    else if (theNumber == AUDIO_BOX) {
        text = 'AUDIO';
    }
    else if (theNumber == TRANSITION) {
        text = 'TRANSITION';
    }
    return text;
}

function init() {

    setStage();
    downloadContentPoint();
}

init();
