function setup() {
  createCanvas(windowWidth, windowHeight);
  SCENES["active"] = "mainscreen";
  SCENES["mainscreen"] = new MainScreen("mainscreen");
  SCENES["challengePicker"] = new ChallengePicker("challengepicker");
  SCENES["creation"] = new Creation();
  SCENES["challenge"] = new Challenge();
}

function switchToChallengePicker() {
  // previous scene clearing
  SCENES["active"] = "challengePicker";
  buttons = [];
  initChallengePositions();
}

function loadChallenge(type) {
  SCENES["active"] = type;
  buttons = [];
  if (type == "creation") {
    loadCreation();
  }
}

function loadCreation() {
  buttons.push(new Button(75, 75, 90, 90, "creationaddbutton", addNodeGUI, ""));
  buttons.push(
    new Button(
      75,
      195,
      90,
      90,
      "creationdeletebutton",
      () => (action = "deleting"),
      "",
    ),
  );
  buttons.push(
    new Button(
      75,
      315,
      90,
      90,
      "creationconnectbutton",
      () => (action = "connecting"),
      "",
    ),
  );
}

function topicClicked(index) {
  buttons[index].clicked = !buttons[index].clicked;
}

function connectNode() {}

function tempNodeFunc(type) {
  drawgui = null;
  guibuttons = [];
  tempnode = new TempNode(type);
}

function moveNode() {}

function selectNode(x, y) {
  let selectedIndex = -1;
  for (let i = 0; i < nodes.length; i++) {
    if (
      x >= nodes[i].x - 30 &&
      x <= nodes[i].x + 30 &&
      y >= nodes[i].y - 30 &&
      y <= nodes[i].y + 30
    ) {
      selectedIndex = i;
    }
  }
  return selectedIndex;
}

function deleteNode(index) {
  nodes.splice(index, 1);
}
