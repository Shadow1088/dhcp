/// <reference path="../node_modules/@types/p5/global.d.ts" />

const NodeTypes = {
  SERVER: "server",
  ROUTER: "router",
  SWITCH: "switch",
  CLIENT: "client",
  FIREWALL: "firewall",
};

class Node {
  constructor(x, y, type, img) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.img = loadImage(`../img/${type}.png`);
  }

  draw() {
    imageMode(CENTER); // Center the image on the node's position
    image(this.img, this.x, this.y, 40, 40); // Adjust width and height as needed
  }
}

class Connection {
  constructor(x1, y1, x2, y2) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
  }
  draw() {
    stroke("orange");
    line(this.x1, this.y1, this.x2, this.y2);
  }
}

class IconButton {
  constructor(x, y, iconPath, description, onClick) {
    this.x = x;
    this.y = y;
    this.w = 50;
    this.h = 50;
    this.iconPath = iconPath;
    this.description = description;
    this.onClick = onClick;
    this.icon = loadImage(iconPath);
  }

  draw() {
    fill("gray");
    rect(this.x, this.y, this.w, this.h, 5);
    image(this.icon, this.x + 5, this.y + 5, this.w - 10, this.h - 10);
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

const stats = {
  overload: 0.7,
  latency: 0.01,
  satisfaction: 0.85,
  money: 0.5,
};

const buttons = [];
const nodes = [];
const connections = [];
let infoText = "Hover over an action for details!";
let showGUI = false;

const hidden_stats = {
  attack_blocking_success_rate: 0.5,
  upgrade_level: 0.5,
  hosts_limit: 255,
  hosts: nodes.length,
};

function setup() {
  createCanvas(1000, 600);
  initializeButtons();

  nodes.push(new Node(200, 200, NodeTypes.SERVER));
  nodes.push(new Node(400, 300, NodeTypes.ROUTER));
  connections.push(new Connection(200, 200, 400, 300));
}

function draw() {
  background(30);
  alternateStats();
  drawSidebar();
  drawInfoBar();
  drawStatFields();
  drawMainCanvas();
  if (showGUI) drawGUI();
}

function mousePressed() {
  buttons.forEach((button) => button.handleClick());
}

function initializeButtons() {
  buttons.push(
    new IconButton(20, 100, "../img/buy.png", "Buy new node", () =>
      toggleGUI("Buy"),
    ),
  );
  buttons.push(
    new IconButton(20, 160, "../img/upgrade.png", "Upgrade node", () =>
      toggleGUI("Upgrade"),
    ),
  );
  buttons.push(
    new IconButton(20, 220, "../img/delete.png", "Delete node", () =>
      toggleGUI("Delete"),
    ),
  );
}

function drawInfoBar() {
  fill("black");
  rect(0, 0, width, 50);
  fill("white");
  textSize(16);
  textAlign(LEFT, CENTER);
  text(infoText, 10, 25);
}

function drawSidebar() {
  fill("black");
  rect(0, 0, 100, height);
  buttons.forEach((button) => {
    button.draw();
    if (button.isHovered()) infoText = button.description;
  });
}

function drawStatFields() {
  const statConfig = [
    { label: "Overload", value: stats.overload, color: "red" },
    { label: "Latency", value: stats.latency, color: "yellow" },
    { label: "Satisfaction", value: stats.satisfaction, color: "green" },
    { label: "Money", value: stats.money, color: "gold" },
  ];

  const startX = 150;
  const startY = 80;
  const barWidth = 150;
  const barHeight = 20;
  const spacing = 200;

  statConfig.forEach((stat, i) => {
    const x = startX + i * spacing;
    fill("white");
    textAlign(CENTER, CENTER);
    textSize(16);
    text(stat.label, x + barWidth / 2, startY - 10);

    fill("gray");
    rect(x, startY, barWidth, barHeight);

    fill(stat.color);
    rect(x, startY, barWidth * stat.value, barHeight);

    fill("white");
    textAlign(CENTER, CENTER);
    text(
      `${Math.round(stat.value * 100)}%`,
      x + barWidth / 2,
      startY + barHeight / 2,
    );
  });
}

function drawMainCanvas() {
  push(); // Save current drawing context
  translate(100, 0);

  // Draw connections
  connections.forEach((conn) => {
    conn.draw(); // Ensure Connection.draw() only defines stroke and line
  });

  // Draw nodes
  nodes.forEach((node) => {
    node.draw(); // Node's draw method handles its own image drawing
  });

  pop(); // Restore drawing context
}

function drawGUI() {
  fill(0, 150);
  rect(0, 0, width, height);
  fill("white");
  textSize(24);
  textAlign(CENTER, CENTER);
  text("GUI Overlay: Interact with Options", width / 2, height / 2);
}

function toggleGUI(action) {
  showGUI = !showGUI;
  infoText = showGUI
    ? `Opened ${action} menu.`
    : "Hover over an action for details!";
}

function alternateStats() {
  // overload
  stats.overload = (hidden_stats.hosts * 1) / 2;
  // latency
  stats.latency = stats.overload ** 1.25;
  // satisfaction
  stats.satisfaction = 1 - (stats.latency ** 2 + Math.sqrt(stats.latency) / 5);
}
