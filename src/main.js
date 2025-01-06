function setup() {
  createCanvas(windowWidth, windowHeight);
  SCENES["active"] = "mainscreen";
  SCENES["mainscreen"] = new MainScreen("mainscreen");
}

function draw() {
  SCENES[SCENES["active"]].draw();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
