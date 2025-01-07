//miscellaneous

function drawChallengeNet() {
  gap = 100;
  push();
  noFill();
  stroke(255, 0, 0);
  rect(gap, gap, windowWidth - 2 * gap, windowHeight - 2 * gap);

  pop();
  for (let i = 0; i < challenges.length; i++) {}
}

function challengebg() {
  if (challengebgnum === 1000) {
    challengebgmoving = true;
  }
  if (challengebgnum === 0) {
    challengebgmoving = false;
  }
  return challengebgmoving;
}
