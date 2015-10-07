// GuitHub, a guitar scale helper web app
// It tells you what notes to play! (sort of)

/*global PIXI */

//Create the renderer
var renderer = PIXI.autoDetectRenderer(1000, 300,
  {antialiasing: true, transparent: false, resolution: 1});

renderer.backgroundColor = 0xF9F9F9;

//Add the canvas to the HTML document
document.getElementById("canvas").appendChild(renderer.view);

//Create a container object called the `stage`
var stage = new PIXI.Container();

renderer.view.style.border = "1px solid #BEBEBE";

//Tell the `renderer` to `render` the `stage`
renderer.render(stage);