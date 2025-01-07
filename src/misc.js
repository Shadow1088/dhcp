//miscellaneous - functions I am not sure where to put

function initChallengePositions() {
  for (let i = 0; i < Object.keys(challenges).length; i++) {
    rand_x = random(100, windowWidth - 2 * 100);
    rand_y = random(100, windowHeight - 2 * 100);
    challengePositions[Object.keys(challenges)[i]] = [rand_x, rand_y];
    buttons.push(
      new Button(
        rand_x,
        rand_y,
        90,
        90,
        "challenge",
        () => topicClicked(i),
        Object.keys(challenges)[i],
      ),
    );
  }
}

function drawClickedChallengeBranches() {
  for (let i = 0; i < buttons.length; i++) {
    if (buttons[i].clicked) {
      let len = Object.keys(challenges[Object.keys(challenges)[i]]).length;
      let degs = 360 / len;
      let gap = 120;

      for (let j = 0; j < len; j++) {
        let angle = radians(degs * j);
        let newX = buttons[i].x + gap * cos(angle);
        let newY = buttons[i].y + gap * sin(angle);

        // Draw circle
        push();
        fill("white");
        circle(newX, newY, 80);
        pop();

        // Create button once
        if (!buttons[i].branchesCreated) {
          buttons.push(
            new Button(
              newX,
              newY,
              70,
              70,
              "challenge",
              () => loadChallenge(),
              j,
            ),
          );
        }
      }
      buttons[i].branchesCreated = true;
    } else if (buttons[i].branchesCreated) {
      // Only remove branches if they were created
      buttons[i].branchesCreated = false;
      // Remove only branches associated with this button
      buttons = buttons.filter((button) => button.parentIndex !== i);
    }
  }
}

function drawChallengeNet() {
  for (let i = 0; i < Object.keys(challenges).length; i++) {
    push();
    fill("white");
    circle(
      challengePositions[Object.keys(challenges)[i]][0],
      challengePositions[Object.keys(challenges)[i]][1],
      80,
    );
    pop();
  }
  drawClickedChallengeBranches();
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
