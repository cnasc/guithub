/*
    Copyright 2015 Christopher Nascone
    This file is part of GuitHub.

    GuitHub is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    GuitHub is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with GuitHub.  If not, see <http://www.gnu.org/licenses/>.
*/
/*global PIXI */

// Create the renderer
var renderer = PIXI.autoDetectRenderer(1000, 300,
  {antialiasing: true, transparent: false, resolution: 1}, true);

// Change the background color to a lovely gray
renderer.backgroundColor = CONSTANTS.appBackgroundColor;

// Add the canvas to the HTML document
document.getElementById("canvas").appendChild(renderer.view);

// Create a container object called the `stage`
var stage = new PIXI.Container();



// Contains specifications for fretboard and functions that draw it
var fretboard = {
  // "12" frets, including nut (so no 12th fret)
  numFrets: 12,
  numStrings: 6,
  width: Math.floor(renderer.width * 0.9),
  height: Math.floor(renderer.height * 0.7),
  hand: 'right',
  board: new PIXI.Graphics(),
  numbers: new PIXI.Container(),

  fretDistance: function () {
    "use strict";
    var distance = this.width / this.numFrets;
    return Math.floor(distance);
  },

  stringDistance: function() {
    "use strict";
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
    // draw the board
    this.board.lineStyle(2, CONSTANTS.fretboardColors.frets, 1);
    this.board.beginFill(CONSTANTS.fretboardColors.fretboard);
    this.board.drawRect(this.xPos(), this.yPos(),
      this.width, this.height);
    this.board.endFill();
  },

  drawNut: function() {
    "use strict";
    var xPos;

    if (this.hand === 'left') {
      xPos = this.xPos() + this.width - this.fretDistance();
    }
    else {
      xPos = this.xPos();
    }
    // draw the nut
    this.board.lineStyle(2, CONSTANTS.fretboardColors.frets, 1);
    this.board.beginFill(0xFFFFFF);
    this.board.drawRect(xPos, this.yPos(),
      this.fretDistance(), this.height);
    this.board.endFill();
  },

  drawFrets: function () {
    "use strict";
    var lineX, i, fretDistance;

    // determine position for first fret
    if (this.hand === 'left') {
      lineX = this.xPos() + this.width - this.fretDistance();
      fretDistance = this.fretDistance() * -1;
    }
    else {
      lineX = this.xPos() + this.fretDistance();
      fretDistance = this.fretDistance();
    }

    for (i = 0; i < this.numFrets - 1; i++) {
      if (i < 1) {
        // draw a thick line for the first "fret" to indicate nut
        this.board.lineStyle(10, CONSTANTS.fretboardColors.frets, 1);
      }
      else {
        this.board.lineStyle(2, CONSTANTS.fretboardColors.frets, 1);
      }

      this.board.moveTo(lineX, this.yPos());
      this.board.lineTo(lineX, this.yPos() + this.height);

      lineX += fretDistance;
    }
  },

  drawStrings: function () {
    "use strict";
    var lineY, i;

    // determine position for first string
    lineY = this.yPos() + this.stringDistance();

    for (i = 0; i < this.numStrings - 2; i++) {
      this.board.lineStyle(1, CONSTANTS.fretboardColors.strings, 1);

      this.board.moveTo(this.xPos(), lineY);
      this.board.lineTo(this.xPos() + this.width, lineY);

      lineY += this.stringDistance();
    }
  },

  drawMarkers: function () {
    "use strict";
    // draw position markers at frets 3, 5, 7, 9
    var offset, radius, xPos, yPos, locations, i, marker;
    offset = 30;
    radius = 10;
    locations = [3, 5, 7, 9];
    yPos = this.yPos() + this.height + offset;

    for (i = 0; i < locations.length; i++) {
      marker = new PIXI.Text(locations[i],
        {font: CONSTANTS.fretLabelFont, fill: CONSTANTS.fretNumberLabelColor});
      if (this.hand === 'left') {
        xPos = (this.xPos() + this.width - (this.fretDistance() / 2)) +
          (this.fretDistance() * (locations[i] * -1));
      }
      else {
        xPos = (this.xPos() + (this.fretDistance() / 2)) +
          (this.fretDistance() * locations[i]);
      }

      marker.anchor.x = 0.5;
      marker.anchor.y = 0.5;
      marker.position.set(xPos, yPos);
      this.numbers.addChild(marker);
    }

  },

  wipe: function () {
    "use strict";
    // clear the contents of the fretboard object
    this.board.removeChildren();
    // clear the position markers
    this.numbers.removeChildren();
  },

  init: function () {
    "use strict";
    this.hand = getRadioValue('hand');
    this.drawBackground();
    this.drawNut();
    this.drawFrets();
    this.drawStrings();
    this.drawMarkers();
    stage.addChild(this.board);
    stage.addChild(this.numbers);
  },

  update: function () {
    "use strict";
    this.wipe();
    this.hand = getRadioValue('hand');
    this.drawBackground();
    this.drawNut();
    this.drawFrets();
    this.drawStrings();
    this.drawMarkers();
  }
};

// returns an array of notes in the scale, or null if tampered with
function buildScale(root, type) {
  "use strict";
  var scale, formula, note;
  formula = CONSTANTS.scales[type];

  scale = [];

  // Checking for error, should only happen if HTML is tampered with
  note = CONSTANTS.chromaticNotes.indexOf(root);
  if (note < 0) {
    return null;
  }
  else {
    scale.push(CONSTANTS.chromaticNotes[note]);
  }

  for (var i = 0; i < formula.length; i++) {
    note = (note + formula[i]) % CONSTANTS.chromaticNotes.length;
    scale.push(CONSTANTS.chromaticNotes[note]);
  }

  return scale;
}

// returns the value of the checked radio button, or fallback if error
function getRadioValue(name, fallback) {
  var radios, value, i;

  radios = document.getElementsByName(name);
  value = fallback;

  for (i = 0; i < radios.length; i++) {
    if (radios[i].checked) {
      value = radios[i].value;
      break;
    }
  }
  return value;
}

// Contains logic regarding the drawing of notes
var notes = {
  graphics: {
    root: new PIXI.Container(),
    second: new PIXI.Container(),
    third: new PIXI.Container(),
    fourth: new PIXI.Container(),
    fifth: new PIXI.Container(),
    sixth: new PIXI.Container(),
    seventh: new PIXI.Container()
  },
  base: {
    root: new PIXI.Container(),
    second: new PIXI.Container(),
    third: new PIXI.Container(),
    fourth: new PIXI.Container(),
    fifth: new PIXI.Container(),
    sixth: new PIXI.Container(),
    seventh: new PIXI.Container()
  },
  strings: ['E', 'B', 'G', 'D', 'A', 'E'],
  hand: 'left',
  wipe: function () {
    "use strict";
    // clear the contents of all container objects
    for (var container in this.graphics) {
      if (this.graphics.hasOwnProperty(container)) {
        var obj = this.graphics[container];
        obj.removeChildren();
      }
    }
    for (var container in this.base) {
      if (this.base.hasOwnProperty(container)) {
        var obj = this.base[container];
        obj.removeChildren();
      }
    }
  },
  getPosition: function (note, string) {
    "use strict";
    // find location for given note on given string
    var stringVal, noteVal, fretNum;

    stringVal = CONSTANTS.chromaticNotes.indexOf(string);
    noteVal = CONSTANTS.chromaticNotes.indexOf(note);

    if (noteVal < stringVal) {
      fretNum = noteVal + CONSTANTS.chromaticNotes.length - stringVal;
    }
    else {
      fretNum = noteVal - stringVal;
    }

    return fretNum;
  },
  populate: function (container, note, color, isRoot, isChordTone) {
    "use strict";
    // draw all instances of a given note into a given container
    var fretNum, i, text, xPos, yPos, labelColor, useFont;
    for (i = 0; i < this.strings.length; i++) {
      fretNum = this.getPosition(note, this.strings[i]);
      yPos = fretboard.yPos() + (i * fretboard.stringDistance());
      if (this.hand === 'left') {
        xPos = (fretboard.xPos() + fretboard.width - (fretboard.fretDistance() / 2)) -
          (fretNum * fretboard.fretDistance());
      }
      else {
        xPos = (fretboard.xPos() + (fretboard.fretDistance() / 2)) +
          (fretNum * fretboard.fretDistance());
      }

      labelColor = isRoot ? CONSTANTS.rootNoteLabelColor : CONSTANTS.noteLabelColor;
      // TODO: get fancier and add the accent as a 2nd text thing of a different size
      useFont = note.length > 1 ? CONSTANTS.accentNoteLabelFont : CONSTANTS.noteLabelFont;
      text = new PIXI.Text(note, {font: useFont,
                                      fill: labelColor,
                                      stroke: labelColor,
                                      strokeThickness: 0
      });
      text.anchor.x = 0.5;
      text.anchor.y = 0.5;
      text.position.set(xPos, yPos);
      ///
      var g = new PIXI.Graphics()
        g.beginFill(color, 1)
        g.drawCircle(xPos,yPos,19)
        container.addChild(g)
      ////
      container.addChild(text);
    }
  },
  baseLayer: function (container, note) {
    "use strict";
    // draw small markers to indicate notes when main layers not active
    var fretNum, i, marker, xPos, yPos, width, height;

    marker = new PIXI.Graphics();
    width = 14;
    height = width;

    for (i = 0; i < this.strings.length; i++) {
      fretNum = this.getPosition(note, this.strings[i]);
      yPos = fretboard.yPos() + (i * fretboard.stringDistance());
      if (this.hand === 'left') {
        xPos = (fretboard.xPos() + fretboard.width - (fretboard.fretDistance() / 2)) -
          (fretNum * fretboard.fretDistance());
      }
      else {
        xPos = (fretboard.xPos() + (fretboard.fretDistance() / 2)) +
          (fretNum * fretboard.fretDistance());
      }
      marker.beginFill(fretboard.black);
      marker.drawRect(xPos, yPos, width, height);
      marker.endFill();
    }

    marker.pivot.x = 7;
    marker.pivot.y = 7;
    container.addChild(marker);
  },
  highlight: function (e) {
    // Highlights chords according to which key was pressed
    var key, keyValue, visible, i, j, layer;
    visible = [];
    key = e.keyCode || e.charCode;
    // check if the key pressed was between 0 and 7, otherwise return
    if (key >= 48 && key <=55) {
      keyValue = key - 48;
    }
    else {
      return;
    }

    if (keyValue == 0) {
      for (i = 0; i < CONSTANTS.scaleDegrees.length; i++) {
        visible.push(CONSTANTS.scaleDegrees[i]);
      }
    }
    else {
      // push the first, third, and fifth degrees relative to keypress
      var first, third, fifth;
      keyValue -= 1;
      first = keyValue;
      third = (keyValue + 2) % CONSTANTS.scaleDegrees.length;
      fifth = (keyValue + 4) % CONSTANTS.scaleDegrees.length;
      visible.push(CONSTANTS.scaleDegrees[first], CONSTANTS.scaleDegrees[third], CONSTANTS.scaleDegrees[fifth]);
    }

    // now loop over degrees and set visible property as needed
    // for some reason this function only works with "notes" instead
    // of "this" (because of event handler scope?)
    for (j = 0; j < CONSTANTS.scaleDegrees.length; j++) {
      layer = CONSTANTS.scaleDegrees[j];
      if (visible.indexOf(layer) > -1) {
        notes.graphics[layer].visible = true;
        notes.base[layer].visible = false;
      }
      else {
        notes.graphics[layer].visible = false;
        notes.base[layer].visible = true;
      }
    }
    // render changes
    renderer.render(stage);
  },
  init: function () {
    "use strict";
    // Add all the containers to the main stage
    for (var container in this.graphics) {
      if (this.graphics.hasOwnProperty(container)) {
        var obj = this.graphics[container];
        stage.addChild(obj);
      }
    }
    for (var container in this.base) {
      if (this.base.hasOwnProperty(container)) {
        var obj = this.base[container];
        obj.visible = false;
        stage.addChild(obj);
      }
    }
  },
  update: function (root, tonality) {
    "use strict";
    var scale, container, baseContainer, i;

    // update fretboard so it can respond to handedness
    fretboard.update();

    scale = buildScale(root, tonality);
    this.wipe();

    this.hand = getRadioValue('hand');

    for (i = 0; i < scale.length; i++) {
      container = this.graphics[CONSTANTS.scaleDegrees[i]];
      baseContainer = this.base[CONSTANTS.scaleDegrees[i]];

      this.populate(container, scale[i], CONSTANTS.noteColors[i], i===0);
      this.baseLayer(baseContainer, scale[i]);
    }

    // make base markers all invisible each time we update
    for (var container in this.base) {
      if (this.base.hasOwnProperty(container)) {
        var obj = this.base[container];
        obj.visible = false;
      }
    }

    // make main markers all visible each time we update
    for (var container in this.graphics) {
      if (this.graphics.hasOwnProperty(container)) {
        var obj = this.graphics[container];
        obj.visible = true;
        stage.addChild(obj);
      }
    }
  }
};

// draw the fretboard, prepare note containers
fretboard.init();
notes.init();

// Tell the `renderer` to `render` the `stage`
renderer.render(stage);

// Add event listener for chord highlighting
window.addEventListener('keypress', notes.highlight, false);

// Handles the click of the submit button
var submitButton = document.getElementById('submit');
submitButton.onclick = function () {
  var root = document.getElementById('root').value;
  var tonality = document.getElementById('tonality').value;
  notes.update(root, tonality);
  renderer.render(stage);
};
