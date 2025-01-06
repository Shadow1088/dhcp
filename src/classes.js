// Main screen? Challenge picker? Playground? (network building)
class Scene {
  constructor(type) {
    this.type = type;
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

// Draw all the nodes, notes, info.
class Challenge {}

class Button {
  constructor(x, y, img, action) {
    this.x = x;
    this.y = y;
    this.img = IMAGES[action];
    this.action = action;
  }
  draw;
}
