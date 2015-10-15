// GuitHub, a guitar scale helper web app
// It tells you what notes to play! (sort of)

/*global PIXI */

// Create the renderer
var renderer = PIXI.autoDetectRenderer(1000, 300,
  {antialiasing: true, transparent: false, resolution: 1});

// Change the background color to a lovely gray
renderer.backgroundColor = 0xF9F9F9;

// Add the canvas to the HTML document
document.getElementById("canvas").appendChild(renderer.view);

// Create a container object called the `stage`
var stage = new PIXI.Container();

// the chromatic scale (all 12 notes in Western music)
var chromatic = ['A', 'A#', 'B', 'C', 'C#', 'D',
  'D#', 'E', 'F', 'F#', 'G', 'G#'];

// Contains interval formulas to compute which notes are in a scale
// Source: http://www.bandnotes.info/tidbits/scales/half-whl.htm
// Sticking with diatonic scales for the time being.
var scales = {
  major:      [2, 2, 1, 2, 2, 2],
  minor:      [2, 1, 2, 2, 1, 2],
  dorian:     [2, 1, 2, 2, 2, 1],
  mixolydian: [2, 2, 1, 2, 2, 1]
};

// Contains specifications for fretboard and functions that draw it
var fretboard = {
  fretboardColor: 0xffefdb,
  black: 0x262626,
  // "12" frets, incluidng nut (so no 12th fret)
  numFrets: 12,
  numStrings: 6,
  width: Math.floor(renderer.width * 0.9),
  height: Math.floor(renderer.height * 0.7),

  fretDistance: function () {
    var distance = this.width / this.numFrets;
    return Math.floor(distance);
  },

  stringDistance: function() {
    var distance = this.height / (this.numStrings - 1);
    return Math.floor(distance);
  },

  xPos: function () {
    "use strict";
    return Math.floor((renderer.width - fretboard.width) / 2);
  },

  yPos: function () {
    "use strict";
    return Math.floor((renderer.height - fretboard.height) / 3);
  },

  drawBackground: function () {
    "use strict";
    var board = new PIXI.Graphics();

    // draw the board
    board.lineStyle(2, this.black, 1);
    board.beginFill(this.fretboardColor);
    board.drawRect(this.xPos(), this.yPos(), this.width, this.height);
    board.endFill();
    stage.addChild(board);
  },

  drawNut: function() {
    var  nut = new PIXI.Graphics();

    // draw the nut
    nut.lineStyle(2, this.black, 1);
    nut.beginFill(0xFFFFFF);
    nut.drawRect(this.xPos(), this.yPos(),
      this.fretDistance(), this.height);
    nut.endFill();
    stage.addChild(nut);
  },

  drawFrets: function () {
    "use strict";
    var lineX, i, fret;

    // determine position for first fret
    lineX = this.xPos() + this.fretDistance();

    for (i = 0; i < this.numFrets - 1; i++) {
      fret = new PIXI.Graphics();
      fret.lineStyle(2, this.black, 1);

      fret.moveTo(lineX, this.yPos());
      fret.lineTo(lineX, this.yPos() + this.height);
      stage.addChild(fret);

      lineX += this.fretDistance();
    }
  },

  drawStrings: function () {
    "use strict";
    var lineY, i, string;

    // determine position for first string
    lineY = this.yPos() + this.stringDistance();

    for (i = 0; i < this.numStrings - 2; i++) {
      string = new PIXI.Graphics();
      string.lineStyle(1, this.black, 1);

      string.moveTo(this.xPos(), lineY);
      string.lineTo(this.xPos() + this.width, lineY);
      stage.addChild(string);

      lineY += this.stringDistance();
    }
  },

  drawBoard: function () {
    "use strict";
    this.drawBackground();
    this.drawNut();
    this.drawFrets();
    this.drawStrings();
  }
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

  // Checking for error, should only happen if HTML is tampered with
  note = chromatic.indexOf(root);
  if (note < 0) {
    return null;
  }
  else {
    scale.push(note);
  }

  for (var i = 0; i < formula.length; i++) {
    note = (note + formula[i]) % chromatic.length;
    scale.push(note);
  }

  return scale;
}

// Contains logic regarding the drawing of notes
var notes = {
  // ROYGBIV colors for notes
  scale: [],
  colors: [0xFF0000,
            0xFF7F00,
            0xFFFF00,
            0x00FF00,
            0x0000FF,
            0x4B0082,
            0x8B00FF
  ],
  strings: ['E', 'B', 'G', 'D', 'A', 'E'],
  findPositions: function (scale, string) {
    "use strict";
    var positions, i, fretNum, stringVal;
    positions = [];
    stringVal = chromatic.indexOf(string);

    for (i = 0; i < scale.length; i++) {
      if (scale[i] < stringVal) {
        fretNum = scale[i] + chromatic.length - stringVal;
      }
      else {
        fretNum = scale[i] - stringVal;
      }
      positions.push(fretNum);
    }

    return positions;
  },
  drawNotes: function(string, location) {
    "use strict";
    var positions, color, yPos, i, fretPos, note;
    positions = this.findPositions(this.scale, string);
    yPos = fretboard.yPos() + (location * fretboard.stringDistance());
    fretPos = fretboard.xPos() + (fretboard.fretDistance() / 2);

    for (i = 0; i < positions.length; i++) {
      color = this.colors[i];
      note = new PIXI.Graphics();
      note.beginFill(color);
      note.lineStyle(2, fretboard.black, 1);
      note.drawCircle(fretPos + (fretboard.fretDistance() * positions[i]), yPos, 18);
      note.endFill();
      stage.addChild(note);
    }
  },
  init: function (root, tonality) {
    this.scale = buildScale(root, tonality);
    this.drawNotes("E", 0);
  }
};

// draw the fretboard
fretboard.drawBoard();

// Tell the `renderer` to `render` the `stage`
renderer.render(stage);

// Handles the click of the submit button
var submitButton = document.getElementById('submit');
submitButton.onclick = function () {
  var root = document.getElementById('root').value;
  var tonality = document.getElementById('tonality').value;
  var scale = buildScale(root, tonality);
  console.log(scale);
  console.log(notes.findPositions(scale, 'E'));
  notes.init(root, tonality);
  renderer.render(stage);
};
