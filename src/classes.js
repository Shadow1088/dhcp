// Main screen? Challenge picker? Playground? (network building)
class Scene {
  constructor(type) {
    this.type = type;
    if (this.type === "mainscreen") {
      buttons.push(
        new Button(
          windowWidth / 2,
          (windowHeight / 5) * 4.7,
          680,
          90,
          "switchtochallengepicker",
          () => switchToChallengePicker(),
          "Whats your next challenge?",
        ),
      );
    }
  }
}

class MainScreen extends Scene {
  constructor(background_img) {
    super("mainscreen");
    this.background_img = IMAGES[background_img];
  }
  draw() {
    imageMode(CORNER);
    image(this.background_img, 0, 0, windowWidth, windowHeight);

    textSize(50);
    textFont("monospace");
    textAlign(CENTER, CENTER);
    fill(255);

    text("NetSimX", windowWidth / 2, windowHeight / 3.1);
    textSize(20);
    textStyle(ITALIC);

    text(
      '"Your favorite educational platform"',
      windowWidth / 2,
      windowHeight / 2.5,
    );
  }
}

class ChallengePicker extends Scene {
  constructor(background_img) {
    super("challengepicker");
    this.background_img = IMAGES[background_img];
  }
  draw() {
    imageMode(CORNER);
    image(this.background_img, 0, 0, windowWidth, windowHeight);
  }
}

// Draw all the nodes, notes, info.
class Challenge {}

class Button {
  constructor(x, y, w, h, action, onClick, text) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.img = IMAGES[action];
    this.action = action;
    this.onClick = onClick;
    this.text = text;
  }

  draw() {
    imageMode(CENTER);
    image(this.img, this.x, this.y, this.w, this.h);

    textSize(25);
    textAlign(CENTER, CENTER);
    text(this.text, this.x, this.y);
  }

  isHovered() {
    return (
      mouseX > this.x &&
      mouseX < this.x + this.w &&
      mouseY > this.y &&
      mouseY < this.y + this.h
    );
  }

  handleClick() {
    if (this.isHovered()) this.onClick();
  }
}
