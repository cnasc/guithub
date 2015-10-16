# GuitHub
A guitar scale helper website. It's a work in progress, and a bit messy at the moment.

### How does it work?
You pick a root note and a tonality, and it draws the scale on the fretboard.

It uses the colors of the rainbow (ROYGBIV) to indicate scale tones, so if you know your colors then you know which fret is which degree of a given scale.

### Current Known Issues
So far the canvas is not cleared in between drawing requests. As a result, some markers linger and make the output garbled and useless. This will be fixed ASAP.

### TODO
- [ ] Fix output
  - [ ] Encapsulate each note in a graphics object
  - [ ] Clear all note graphics on submit
- [ ] Better clarity
  - [ ] Colorblind friendly display options
  - [x] Thicker line to differentiate the nut
  - [ ] Note names inside markers
- [ ] Chord tone highlighting
