function setup() {
  createCanvas(windowWidth, windowHeight);
  SCENES["active"] = "mainscreen";
  SCENES["mainscreen"] = new MainScreen("mainscreen");
  SCENES["challengePicker"] = new ChallengePicker("challengepicker");
}

function draw() {
  // draw active scene
  SCENES[SCENES["active"]].draw();

  // draw buttons
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].draw();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function mouseClicked() {
  // check if a button was clicked
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].handleClick();
  }
}
