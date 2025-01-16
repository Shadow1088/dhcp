// Main screen? Challenge picker? Playground?

class Scene {
  constructor(type) {
    this.type = type;
    switch (this.type) {
      case "mainscreen":
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
    image(
      this.background_img,
      -1000 + challengebgnum,
      0,
      windowWidth + 1000,
      windowHeight,
    );
    drawChallengeNet();
  }
}

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
    this.clicked = false;
    this.branchesCreated = false;
  }

  draw() {
    imageMode(CENTER);
    image(this.img, this.x, this.y, this.w, this.h);
    if (this.action === "challengebutton") {
      stroke("black");
    }
    textSize(25);
    textAlign(CENTER, CENTER);
    text(this.text, this.x, this.y);
    noStroke();
  }

  isHovered() {
    return (
      mouseX > this.x - this.w / 2 &&
      mouseX < this.x + this.w / 2 &&
      mouseY > this.y - this.h / 2 &&
      mouseY < this.y + this.h / 2
    );
  }

  handleClick() {
    if (this.isHovered()) this.onClick();
    if (this.action == "creationaddbutton" && this.isHovered()) {
      drawgui = () => addNodeGUI();
    }
  }
}

class Node {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.ip = "192.168.1." + floor(random(10, 255));
    this.img = IMAGES[type];
    this.interfaces = {}; //"0/1":connection?
    this.FIB = {};
    this.receivedFrames = [];
  }
  draw() {
    imageMode(CENTER);
    image(this.img, this.x, this.y, 40, 40);

    textSize(12);
    textAlign(CENTER);

    text(this.ip, this.x, this.y + 30);
  }
  handleFrames() {
    for (let i = 0; i < this.receivedFrames; i++) {
      // ran
      let frame = this.receivedFrames[i];
      for (let j = 0; j < frame.protocol.receiverMethods.length; j++) {
        frame.protocol.receiverMethods[i]();
      }
      if (frame.dIP == this.ip) {
        for (let j = 0; j < frame.protocol.targetMethods.length; j++) {
          frame.protocol.targetMethods[i]();
        }
      }
    }
  }
  forwardFrames(frame) {
    // if broadcast
    if (d.IP == "255.255.255.255") {
      // for every node
      for (let i = 0; i < nodes.length; i++) {
        // check its interfaces
        let conns = Object.keys(nodes[i].interfaces);
        // is the node connected to this node?
        for (let j = 0; j < conns.length; j++) {
          if (conns[j] == this.mac) {
            nodes[i].receivedFrames.push(frame);
          }
        }
      }
    }
  }
}

// created once a button in addNode clicked - creator (user) after choosing the node still needs to decide where to place it
// and so a fake copy of the node is drawn out on the screen, once creator (user) clicks, it creates real Node with temp node's properties
class TempNode extends Node {
  constructor(type) {
    super(mouseX, mouseY, type);
    this.finished = false; // placed the node?
  }
  draw() {
    imageMode(CENTER);
    image(this.img, this.x, this.y, 40, 40);

    textSize(12);
    textAlign("center");
    text(this.ip, this.x, this.y + 30);
  }
  update() {
    this.x = mouseX;
    this.y = mouseY;
    if (this.finished) {
      nodes.push(new Node(this.x, this.y, this.type));
      tempnode = null;
    }
  }
}

// Draw all the nodes, notes, info.
class Challenge {}

class Creation extends Scene {
  constructor() {
    super("creation");
    this.nodes = [];
    this.connection = [];
  }
  draw() {
    push();

    background("grey");

    fill("black");
    rect(0, 0, 150, windowHeight);

    imageMode(CENTER);

    pop();
  }
  update() {}
}
