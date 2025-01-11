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
    new Button(75, 195, 90, 90, "creationdeletebutton", () => deleteNode(), ""),
  );
  buttons.push(
    new Button(
      75,
      315,
      90,
      90,
      "creationconnectbutton",
      () => connectNode(),
      "",
    ),
  );
}

function topicClicked(index) {
  buttons[index].clicked = !buttons[index].clicked;
}

function connectNode() {}

function deleteNode() {}

function tempNodeFunc(type) {
  tempnode = new TempNode(type);
  drawgui = null;
}
