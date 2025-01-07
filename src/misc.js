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
        "challengebutton",
        () => topicClicked(i),
        Object.keys(challenges)[i],
      ),
    );
  }
}

function drawClickedChallengeBranches() {
  for (let i = 0; i < buttons.length; i++) {
    if (buttons[i].clicked && !buttons[i].branchesCreated) {
      // Create buttons once when clicked
      let len = Object.keys(challenges[Object.keys(challenges)[i]]).length;
      let degs = 360 / len;
      let gap = 120;

      for (let j = 0; j < len; j++) {
        let angle = radians(degs * j);
        let newX = buttons[i].x + gap * cos(angle);
        let newY = buttons[i].y + gap * sin(angle);
        let type =
          Object.keys(challenges)[i] === "CREATE" ? "creation" : "challenge";

        let branchButton = new Button(
          newX,
          newY,
          60,
          60,
          "challengebutton",
          () => loadChallenge(type),
          j,
        );
        branchButton.parentIndex = i;
        branchButton.isBranch = true; // Add this flag
        buttons.push(branchButton);
      }
      buttons[i].branchesCreated = true;
    } else if (!buttons[i].clicked && buttons[i].branchesCreated) {
      buttons[i].branchesCreated = false;
      buttons = buttons.filter((button) => button.parentIndex !== i);
    }
    // Draw lines if button is clicked
    if (buttons[i].clicked) {
      push();
      stroke("white");
      buttons.forEach((button) => {
        if (button.isBranch && button.parentIndex === i) {
          line(button.x, button.y, buttons[i].x, buttons[i].y);
        }
      });
      pop();
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
