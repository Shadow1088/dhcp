function switchToChallengePicker() {
  // previous scene clearing
  SCENES["active"] = "challengePicker";
  buttons = [];
  initChallengePositions();
}

function loadChallenge() {
  SCENES["active"] = "challenge";
  buttons = [];
}

function topicClicked(index) {
  buttons[index].clicked = !buttons[index].clicked;
}
