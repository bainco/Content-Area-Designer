/**
 * @overview This script deals with the map interface for adding content areas.
 * @name    map.js
 * @author 	Connor Bain (bainco@email.sc.edu)
 * @version 0.1
 */
/* CONSTANTS */
/** @constant {number} width of map*/
var MAP_WIDTH = 657;
/** @constant {number} height of map*/
var MAP_HEIGHT = 667;

/** @global {Image} the fingerprint image*/
var gFingerPrintImage;
/** @global {ContentArea[]} array of ContentAreas*/
var gContentAreas;
/** @global {Kinetic.Stage} our stage*/
var gStage;
/** @global {Kinetic.Layer} layer for the fingerprints/ContentAreas*/
var gFingerPrint_layer;
/** @global {Kinetic.Layer} layer for the background*/
var gBackground_layer;

/**
 * Initialize the page.
 *
 * Set the Kinetic.Stage for drawing, assign default values to global variables,
 * and load necessary images.
 */
function init() {

    gStage = new Kinetic.Stage({
        container: 'container',
        width: 657,
        height: 667,
      });

    gFingerPrint_layer = new Kinetic.Layer();

    downloadContentAreas();

    gFingerPrintImage = new Image();
    gFingerPrintImage.src = 'img/fingerprint.png'; //Location of our background

    setupBackground();
    gStage.add(gFingerPrint_layer);
}

/**
 * Setup the background.
 *
 * Load the correct image, sets the layer, adds it to the stage, and
 * then sets a listener on it.
 */
function setupBackground() {

     //Layer for our background
    gBackground_layer = new Kinetic.Layer();

    //Canvas background image
    var canvasBackgroundImage = new Image();
    canvasBackgroundImage.src = 'img/map.png'; //Location of our background
    canvasBackgroundImage.onload = function() {
        var backgroundImage = new Kinetic.Image({
            x: 0,
            y: 0,
            image: canvasBackgroundImage,
            width: MAP_WIDTH,
            height: MAP_HEIGHT
        });

        backgroundImage.on("dblclick dbltap", function() {
            createContentArea(gStage.getPointerPosition());
        });

        gBackground_layer.add(backgroundImage);
        gBackground_layer.draw();
    };

    gStage.add(gBackground_layer);
}

/**
 * Downloads the ContentAreas from the server.
 *
 * STUB
 */
function downloadContentAreas() {

    //TO-DO STUB
    console.log("Loading fingerprints.");
}

/**
 * Uploads the ContentAreas to the server.
 *
 * STUB
 */
function uploadContentAreas() {

    //TO-DO STUB
    console.log("Uploaded new area to server.");
}

/**
 * Creates a content area.
 *
 * Takes the current mouseLocation and adds a ContentArea to the map
 * at that point. Also prompts for a title.
 *
 * @param {Object} mouseLocation The 2d vector mouse location.
 */
function createContentArea(mouseLocation) {

    var title = prompt("Please enter the name of the content point:","");

    //Correct to center fingerPrint
    mouseLocation.x = mouseLocation.x - (gFingerPrintImage.width / 2);
    mouseLocation.y = mouseLocation.y - (gFingerPrintImage.height / 2);

    uploadContentAreas();
    drawContentArea(mouseLocation, title);

    console.log("Added content area to map.");
    //window.location.replace("");
}

/**
 * Draws a ContentArea.
 *
 * Takes an input ID and location and draws a fingerprint on the map by
 * adding it to the fingerprint layer. Also sets listeners on that fingerprint.
 */
function drawContentArea(theLocation, theID) {

    console.log("Drawing?");
    var contentArea = new Kinetic.Image({
		x: theLocation.x,
		y: theLocation.y,
		image: gFingerPrintImage,
		id: theID
	});

	contentArea.on('mousedown', function() {
	   console.log(contentArea.id());
	});

    contentArea.on('dblclick', function() {

        //STUB FOR REDIRECT TO ADD/EDIT PAGE
    });

	gFingerPrint_layer.add(contentArea);
	gFingerPrint_layer.draw();
}

init();
