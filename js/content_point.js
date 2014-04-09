/**
 * @overview This script deals with content point creation.
 * @name    content_point.js
 * @author 	Connor Bain (bainco@email.sc.edu)
 * @version 0.1
 */

/* CONSTANTS */
/** @constant {number} integer code for text box*/
var TEXT_BOX = 0;
/** @constant {number} integer code for image box*/
var IMAGE_BOX = 1;
/** @constant {number} integer code for video box*/
var VIDEO_BOX = 2;
/** @constant {number} integer code for audio box*/
var AUDIO_BOX = 3;
/** @constant {number} integer code for transition box*/
var TRANSITION = 4;

/** @constant {number} width of content point (parchment)*/
var CP_WIDTH = 824;

/** @constant {number} height of content point (parchment)*/
var CP_HEIGHT = 625;

/** @constant {number} */
var DEFAULT_STROKE_WIDTH = 2;

/** @global {ContentBox[]} array of ContentBox objects for this ContentPoint*/
var gTheBoxes;
/** @global {number} current count of content boxes (includes deleted boxes)*/
var gBoxCount;
/** @global {number} id of currently selected tool */
var gCurrentTool;
/** @global {boolean} whether or not we are drawing*/
var gDrawing;
/** @global {ContentBox} represents the currently selected content box*/
var gCurrentBox;
/** @global {Kinetic.Stage} our display stage*/
var gStage;
/** @global {Kinetic.Layer} the layer for our background*/
var gBackground_layer;
/** @global {Kinetic.Layer} the layer we draw on*/
var gDrawing_layer;
/** @global {Kinetic.Layer} the layer we put finalized ContentBoxes on*/
var gBox_layer;

/** @global {Image} the image for the close button*/
var closeButton_Image;

/**
 * Initialize the page.
 *
 * Set the Kinetic.Stage for drawing, assign default values to global variables,
 * and load necessary images.
 */
function init() {

    gStage = new Kinetic.Stage({
	   container: 'container',
	   width: CP_WIDTH,
	   height: CP_HEIGHT,
    });

    setupBackground();

    closeButton_Image = new Image();
    closeButton_Image.src = 'img/close.png'; //Location of our background

    //Default values
    gTheBoxes = new Array();
    //downloadContentPoint(); STUB TO-DO
    gDrawing_layer = new Kinetic.Layer()
    gBox_layer = new Kinetic.Layer();
    gDrawing = false;
    gCurrentTool = 0;
    gBoxCount = 0;

    gStage.add(gBackground_layer);
    gStage.add(gBox_layer);
    gStage.add(gDrawing_layer);
}

/**
 * Initialize the background.
 *
 * Loads the necessary image and sets it as the background of our stage. Also
 * setups drawing handlers for click-drag movements on stage.
 */
function setupBackground() {

    gBackground_layer = new Kinetic.Layer();

    gBackground_layer.on('mousedown', function() {

        //Clear gDrawing_layer
        gDrawing_layer.removeChildren();

        var mouse = gStage.getPointerPosition();

        //create a new current box
        gCurrentBox = new Kinetic.Rect({
            x: mouse.x,
            y: mouse.y,
            width: 0,
            height: 0,
            strokeWidth: DEFAULT_STROKE_WIDTH
        });

        var color = getBoxColor(gCurrentTool);
        gCurrentBox.stroke(color);

        //On mouse up from current box, finalize and redraw the screen
        gCurrentBox.on('mouseup', function() {
                console.log("Mouse up");
                gDrawing = false;
                finalizeDrawing();
                drawAll();
                gStage.on('mousemove', function(){});
                gDrawing_layer.draw();
            });

            gDrawing = true;
            gStage.on('mousemove', handleDraw);
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

        gBackground_layer.add(backgroundImage);
        gBackground_layer.draw();
    };
    canvasBackgroundImage.src = 'img/cp_background.png'; //Location of our background
}


/**
 * Draws a ContentBox.
 *
 * This method takes a ContentBox and draws it on our gStage. The color and label
 * of the box depend on the type of the box. Also sets listeners on the box for
 * double click and single click.
 *
 * @param {ContentBox} theContentBox The box to draw.
 */
function drawContentBox(theContentBox) {

    var color = getBoxColor(theContentBox.type);
    var theText = getBoxText(theContentBox.type);

    //Text label
    var textBox = new Kinetic.Text({
        text: theText,
        fontSize: 18,
        fontFamily: 'Arial',
        align: 'center',
        fill: color
    });

    //Center text label
    textBox.x((((theContentBox.x + theContentBox.width) + theContentBox.x) / 2) - (textBox.width() / 2));
    textBox.y((((theContentBox.y + theContentBox.height) + theContentBox.y) / 2) - (textBox.height() / 2));

    //Create the box
    var rect = new Kinetic.Rect({
        x: theContentBox.x,
        y: theContentBox.y,
        width: theContentBox.width,
        height: theContentBox.height,
        stroke: color,
        strokeWidth: DEFAULT_STROKE_WIDTH,
        id: theContentBox.id
      });

    //On double click, we prompt for file upload.
    rect.on('dblclick', function() {

        console.log("Edit click: " + this.id());
        //STUB FOR FILE INPUT
    });

    //On single click, we 'select' this box by calling selectBox
    rect.on('mousedown',function() {

        selectBox(this);
        console.log(this.id());
    });

    //Add the label and box to the appropriate layer.
    gBox_layer.add(textBox);
    gBox_layer.add(rect);
}

/**
 * Draw all of the ContentBox objects.
 *
 * Loops through gTheBoxes and calls drawContentBox on each object.
 *
 * Note: some of the objects in the array are empty b/c of the capability
 * to delete a ContentBox.
 */
function drawAll() {

    gDrawing_layer.removeChildren(); //Clear the gDrawing_layer
    gBox_layer.removeChildren();  //Clear the gBox_layer
    for (var i = 0; i < gTheBoxes.length; i++) {
        if (gTheBoxes[i] != null) {
            drawContentBox(gTheBoxes[i]);
        }
    }
    gBox_layer.draw(); //Draw the layer
}

/**
 * Handles the drawing routine.
 *
 * Draws as the user draws one on the gStage.
 */
function handleDraw() {

    //Only run if we're actually drawing
    if (gDrawing && (gCurrentBox != undefined)) {
        console.log("drawing!");
        var mouse = gStage.getPointerPosition();

        gCurrentBox.width(mouse.x - gCurrentBox.x());
        gCurrentBox.height(mouse.y - gCurrentBox.y());

        gDrawing_layer.add(gCurrentBox);
        gDrawing_layer.draw();
    }
}

/**
 * Changes the selected tool.
 *
 * Takes its input from the button on the HTML page.
 *
 * @param {number} selection The ID of the newly selected tool.
 */
function selectTool(selection) {

    gCurrentTool = selection;
}

/**
 * Converts a drawing into a ContentBox
 *
 * Takes the gCurrentBox and copies it into an official ContentBox
 * object. Also snaps to a grid based on 20px rules. Finally, adds
 * to the list of boxes (gTheBoxes).
 */
function finalizeDrawing() {

    var x = Math.round(gCurrentBox.x() / 20) * 20;
    var y = Math.round(gCurrentBox.y() / 20) * 20;

    var width = Math.round(gCurrentBox.width() / 20) * 20;
    var height = Math.round(gCurrentBox.height() / 20) * 20;

    var theBox = new ContentBox(gBoxCount, gCurrentTool, x, y, width, height);
    gCurrentBox = null;
    gTheBoxes[gBoxCount] = theBox;
    gBoxCount++;
}

/**
 * 'Selects' a ContentBox on the gStage.
 *
 * Gets the id of the Kinetic.Rect and then grabs the corresponding ContentBox
 * from the list of content boxes (gTheBoxes). Then creates and displays
 * our close button for that box.
 *
 * @param {Kinetic.Rect} theRect The rectangle that was clicked on the gStage.
 */
function selectBox(theRect) {
    gDrawing_layer.removeChildren();

    var loadBox = gTheBoxes[theRect.id()];

    //Create the close button
    var closeButton = new Kinetic.Image({
        x: loadBox.x - (closeButton_Image.width / 2),
        y: loadBox.y - (closeButton_Image.height / 2),
        image: closeButton_Image
    });

    //Set the close button listener
    closeButton.on('mousedown', function() {
        gTheBoxes[theRect.id()] = null;
        gDrawing_layer.clear();
        drawAll();
    });

    //Add and draw the close button in the gDrawing_layer
    gDrawing_layer.add(closeButton);
    gDrawing_layer.draw();

    /*
    STUB FOR HANDLING DRAGGING
    */

    /*
    STUB FOR HANDLING RESIZE
    */
}

/**
 * Converts tool id to color.
 *
 * @param {number} theNumber The ID of a tool.
 * @return {String} color The hex for the tool color.
 */
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

/**
 * Converts tool id to string.
 *
 * @param {number} theNumber The ID of a tool.
* @return {String} color The tool name.
 */
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

init();
