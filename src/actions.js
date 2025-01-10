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
  buttons.push(new Button(60, 60, 90, 90, "creationaddbutton", addNodeGUI, ""));
  buttons.push(
    new Button(75, 180, 90, 90, "creationdeletebutton", () => deleteNode(), ""),
  );
  buttons.push(
    new Button(
      75,
      300,
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
