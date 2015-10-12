// GuitHub, a guitar scale helper web app
// It tells you what notes to play! (sort of)

/*global PIXI */

// Maple-ish color for fretboard
var fretboardColor = 0xffefdb;

// "black" value for outlines
var black = 0x262626;

// number of frets, 12 are easy to fit and really all that are necessary
var numFrets = 12;

// the chromatic scale (all 12 notes in Western music)
var chromatic = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];

// Contains interval formulas to compute which notes are in a scale
// Source: http://www.bandnotes.info/tidbits/scales/half-whl.htm
// Sticking with diatonic scales for the time being.
var scales = {
  major:      [2, 2, 1, 2, 2, 2, 1],
  minor:      [2, 1, 2, 2, 1, 2, 2],
  dorian:     [2, 1, 2, 2, 2, 1, 2],
  mixolydian: [2, 2, 1, 2, 2, 1, 2]
};

// returns an array of notes in the scale, or 
function buildScale(root, type) {
  "use strict";
  var scale, formula, note;
  
  switch (type) {
    case "major":
      formula = scales.major;
      break;
    case "minor":
      formula = scales.minor;
      break;
    case "dorian":
      formula = scales.dorian;
      break;
    case "mixolydian":
      formula = scales.mixolydian;
      break;
    default:
      // This should only happen if the user tampers with the HTML
      return null;
  }
  
  scale = [];
  note = chromatic.indexOf(root);
  scale.push(note);
  
  for (var i = 0; i < formula.length; i++) {
    note = (note + formula[i]) % chromatic.length;
    scale.push(note);
  }
  
  return scale;
}

function drawFretboard(stage, renderer) {
  "use strict";
  var board, string, fret, width, height, xPos, yPos, lineX, lineIncr;
  
  // determine width and height of board
  // width will be 90% of the canvas
  width = Math.floor(renderer.width * 0.9);
  // height will be 60% of the canvas
  height = Math.floor(renderer.height * 0.6);
  
  // board will be horizontally centered...
  xPos = Math.floor((renderer.width - width) / 2);
  // ... and vertically positioned in the top 2/3 of the canvas
  yPos = Math.floor((renderer.height - height) / 3);
  
  // instantiate the board
  board = new PIXI.Graphics();
  
  // set an opaque 2 pixel border and fill rect with nice color
  board.lineStyle(2, black, 1);
  board.beginFill(fretboardColor);
  
  // actually draw the rectangle
  board.drawRect(xPos, yPos, width, height);
  
  // finish drawing the rectangle and add the drawing to the canvas
  board.endFill();
  stage.addChild(board);
  
  // now to draw the frets (1-based because the value of i only matters insofar as it is less than numFrets)
  lineIncr = Math.floor(width / 12);
  lineX = xPos + lineIncr;
  for (var i = 1; i < numFrets; i++) {
    fret = new PIXI.Graphics();
    fret.lineStyle(2, black, 1);
    
    // move the line to the appropriate coordinates (use yPos and height because they don't change)
    fret.moveTo(lineX, yPos);
    fret.lineTo(lineX, yPos + height);
    stage.addChild(fret);
    
    lineX += lineIncr;
  }
}

// Create the renderer
var renderer = PIXI.autoDetectRenderer(1000, 300,
  {antialiasing: true, transparent: false, resolution: 1});

// Change the background color to a lovely gray
renderer.backgroundColor = 0xF9F9F9;

// Add the canvas to the HTML document
document.getElementById("canvas").appendChild(renderer.view);

// Create a container object called the `stage`
var stage = new PIXI.Container();

// draw the fretboard
drawFretboard(stage, renderer);

// Tell the `renderer` to `render` the `stage`
renderer.render(stage);
