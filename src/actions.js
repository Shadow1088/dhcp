function switchToChallengePicker() {
  // previous scene clearing
  SCENES["active"] = "challengePicker";
  buttons = [];
  initChallengePositions();
}

function loadChallenge(type) {
  SCENES["active"] = type;
  buttons = [];
}

function topicClicked(index) {
  buttons[index].clicked = !buttons[index].clicked;
}
