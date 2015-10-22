# GuitHub
A guitar scale helper website as my final project for CS50 through EdX. It's a work in progress, and a bit messy at the moment.

### How does it work?
You pick a root note and a tonality, and it draws the scale on the fretboard. Use number keys 1 through 7 to toggle chord highlighting (think Nashville numbering, 1 = root and so on), or 0 to show all the notes in the scale.

It uses the colors of the rainbow (ROYGBIV) to indicate scale tones, so if you know your colors then you know which fret is which degree of a given scale.

### Can I use it right now?
Yes! head to cnasc.github.io to give it a try.

### TODO
- [x] Left-hand display option
- [ ] Better clarity
  - [ ] Colorblind friendly display options
  - [ ] Improve text rendering
  - [ ] Better support for high PPI displays
  - [x] Thicker line to differentiate the nut
  - [x] Note names as markers
- [x] Fix output
  - [x] Encapsulate each note in a text object
  - [x] Clear all note graphics on submit
- [x] Position markers for easy glances
- [x] Chord tone highlighting
  - [x] Base layer of markers to show where notes outside chord are
  - [x] Toggle highlighting with number keys (1-7 for chords, 0 for full)
