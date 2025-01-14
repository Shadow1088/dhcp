function setup() {
  createCanvas(windowWidth, windowHeight);
  SCENES["active"] = "mainscreen";
  SCENES["mainscreen"] = new MainScreen("mainscreen");
  SCENES["challengePicker"] = new ChallengePicker("challengepicker");
  SCENES["creation"] = new Creation();
  SCENES["challenge"] = new Challenge();
}

function draw() {
  iteration = iteration < 1000 ? iteration + 1 : 0;
  challengebgnum = challengebg() ? challengebgnum - 1 : challengebgnum + 1;

  action =
    drawgui != null
      ? "gui"
      : tempnode != null
        ? "placing"
        : action == "moving"
          ? "moving"
          : null;

  SCENES[SCENES["active"]].draw();

  for (let i = 0; i < buttons.length; i++) {
    buttons[i].draw();
  }

  if (tempnode) {
    tempnode.draw();
    tempnode.update();
  }

  if (drawgui != null) {
    drawgui();
    for (let i = 0; i < guibuttons.length; i++) {
      guibuttons[i].draw();
    }
  }
  if (nodes.length) {
    for (let i = 0; i < nodes.length; i++) {
      nodes[i].draw();
    }
  }
}

function mouseClicked() {
  if (tempnode) {
    tempnode.finished = true;
  }

  // check if a button was clicked
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].handleClick();
  }

  for (let i = 0; i < guibuttons.length; i++) {
    guibuttons[i].handleClick();
  }
}

function mousePressed() {
  if (action == null) {
    selectedNode = selectNode(mouseX, mouseY);
    console.log(selectedNode);
    if (selectedNode != -1) {
      action = "moving";
    }
  }

  if (action == "moving") {
  }
}

function mouseReleased() {
  if (action == "moving") {
    action = null;
  }
}
