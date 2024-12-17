/// <reference path="../node_modules/@types/p5/global.d.ts" />

const nodeImages = {};

function preload() {
  Object.values(NodeTypes).forEach((type) => {
    nodeImages[type] = loadImage(`../img/${type}.png`);
  });
}

const NodeTypes = {
  SERVER: "server",
  ROUTER: "router",
  SWITCH2: "switch2",
  SWITCH3: "switch3",
};

class Node {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.img = nodeImages[type];
  }

  draw() {
    imageMode(CENTER);
    image(this.img, this.x, this.y, 40, 40);
  }
}

class Connection {
  constructor(node1, node2) {
    this.x1 = node1.x;
    this.y1 = node1.y;
    this.x2 = node2.x;
    this.y2 = node2.y;
  }
  draw() {
    stroke("orange");
    line(this.x1, this.y1, this.x2, this.y2);
  }
}

class IconButton {
  constructor(x, y, type, description, onClick) {
    this.x = x;
    this.y = y;
    this.w = 50;
    this.h = 50;
    this.description = description;
    this.onClick = onClick;
    this.type = type;
    this.img = loadImage(`../img/${type}.png`);
  }

  draw() {
    fill("gray");
    rect(this.x, this.y, this.w, this.h, 5);
    image(this.img, this.x + 5, this.y + 5, this.w - 10, this.h - 10);
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

const buttons = [];
const nodes = [];
const connections = [];
let infoText = "Hover over an action for details!";
let showGUI = false;
let currentHoverType = "";
let currentAction = "";
// network and broadcast address
let hosts_limit_constant = 2;

const stats = {
  overload: 0.7,
  latency: 0.01,
  satisfaction: 0.85,
  money: 0.5,
};

const hidden_stats = {
  attack_blocking_success_rate: 1,
  upgrade_level: 0.1,
  hosts_limit: 16,
  hosts: nodes.length,
  current_balance: 1000,
  current_balance_limit: 1000,
};

let placingNode = null;
let isPlacingNode = false;

function setup() {
  createCanvas(1000, 700);
  initializeButtons();
  hidden_stats.hosts = nodes.length;
}

function draw() {
  background(30);
  alternateStats();
  drawStatFields();
  drawSidebar();
  drawInfoBar();
  drawMainCanvas();

  if (isPlacingNode && currentHoverType !== "") {
    const tempNode = new Node(mouseX - 100, mouseY, currentHoverType);
    push();
    translate(100, 0);
    tempNode.draw();
    pop();

    stroke(255, 0, 0, 150);
    noFill();
    ellipse(mouseX, mouseY, 60, 60);
    noStroke();
  }

  if (connecting && firstNode) {
    push();
    translate(100, 0);
    stroke("orange");
    line(firstNode.x, firstNode.y, mouseX - 100, mouseY);
    pop();
  }

  if (showGUI) {
    drawGUIinterface();
    if (currentAction === "buy") drawBuyGUI();
  }
}

function mousePressed() {
  buttons.forEach((button) => button.handleClick());

  if (isPlacingNode && currentHoverType !== "" && mouseX > 100) {
    nodes.push(new Node(mouseX - 100, mouseY, currentHoverType));
    hidden_stats.hosts = nodes.length;
    placingNode = null;
    isPlacingNode = false;
    currentHoverType = "";
    showGUI = false;
  }

  if (connecting) {
    const selectedNodeIndex = selectNode(mouseX - 100, mouseY);

    if (selectedNodeIndex != -1) {
      if (!firstNode) {
        firstNode = nodes[selectedNodeIndex];
        infoText = "Select second node to connect";
      } else {
        const secondNode = nodes[selectedNodeIndex];
        if (firstNode != secondNode) {
          connections.push(new Connection(firstNode, secondNode));
          connecting = false;
          firstNode = null;
          infoText = "Connection created!";
        } else {
          infoText = "Cannot connect node to itself!";
        }
      }
    }
  }
}

function initializeButtons() {
  buttons.push(
    new IconButton(20, 100, "buy", "Buy new node", () => toggleGUI("buy")),
  );
  buttons.push(
    new IconButton(20, 160, "connect", "Connect two nodes", () => connect()),
  );
}

function selectNode(x, y) {
  let selectedIndex = -1;
  nodes.forEach((node, index) => {
    if (
      x >= node.x - 30 &&
      x <= node.x + 30 &&
      y >= node.y - 30 &&
      y <= node.y + 30
    ) {
      selectedIndex = index;
    }
  });
  return selectedIndex;
}

// connections work like this:
//
// wait for first selected node
// draw line between node1.x, node1.y and mouseX, mouseY
// wait for second selected node
// add the connection

let connecting = false;
let firstNode = null;

function connect() {
  connecting = true;
  infoText = "Select first node to connect";
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

function drawMainCanvas() {
  push();
  translate(100, 0);
  connections.forEach((conn) => conn.draw());
  nodes.forEach((node) => node.draw());
  pop();
}

function drawGUIinterface() {
  fill(0, 150);
  rect(0, 0, width, height);
  fill("white");
  textSize(24);
  textAlign(CENTER, CENTER);
  text("GUI Overlay: Interact with Options", width / 2, height / 2);
}

function drawBuyGUI() {
  fill(0, 150);
  rect(0, 0, width, height);

  const panelWidth = 600;
  const panelHeight = 400;
  const startX = (width - panelWidth) / 2;
  const startY = (height - panelHeight) / 2;

  fill(50);
  rect(startX, startY, panelWidth, panelHeight, 10);

  fill(255);
  textSize(24);
  textAlign(CENTER);
  text("Buy Network Components", width / 2, startY + 40);

  const itemSize = 100;
  const margin = 20;
  const itemsPerRow = 4;

  const buyableItems = [
    { type: NodeTypes.SERVER, cost: 2000 },
    { type: NodeTypes.ROUTER, cost: 100 },
    { type: NodeTypes.SWITCH2, cost: 80 },
    { type: NodeTypes.SWITCH3, cost: 400 },
  ];

  buyableItems.forEach((item, index) => {
    const row = Math.floor(index / itemsPerRow);
    const col = index % itemsPerRow;

    const x = startX + margin + col * (itemSize + margin);
    const y = startY + 80 + row * (itemSize + margin);

    fill(70);
    rect(x, y, itemSize, itemSize, 5);

    const img = nodeImages[item.type];
    image(img, x + 20, y + 20, 60, 60);

    fill(255);
    textSize(14);
    textAlign(CENTER);
    text(item.type, x + itemSize / 2, y + 15);

    fill(255, 215, 0);
    text(`$${item.cost}`, x + itemSize / 2, y + itemSize - 10);

    if (
      mouseX > x &&
      mouseX < x + itemSize &&
      mouseY > y &&
      mouseY < y + itemSize
    ) {
      noFill();
      stroke(255);
      rect(x, y, itemSize, itemSize, 5);
      if (mouseIsPressed && hidden_stats.current_balance >= item.cost) {
        currentHoverType = item.type;
        hidden_stats.current_balance -= item.cost;
        isPlacingNode = true;
        placingNode = null;
        showGUI = false;
      } else if (mouseIsPressed && stats.money * 10000 < item.cost) {
        infoText = "Insufficient funds to purchase this item!";
      }
    }
    noStroke();
  });

  const closeBtn = {
    x: startX + panelWidth - 40,
    y: startY + 10,
    size: 30,
  };

  fill(100);
  rect(closeBtn.x, closeBtn.y, closeBtn.size, closeBtn.size, 5);
  fill(255);
  textSize(20);
  text("×", closeBtn.x + closeBtn.size / 2, closeBtn.y + closeBtn.size / 2);

  if (
    mouseX > closeBtn.x &&
    mouseX < closeBtn.x + closeBtn.size &&
    mouseY > closeBtn.y &&
    mouseY < closeBtn.y + closeBtn.size &&
    mouseIsPressed
  ) {
    showGUI = false;
  }
}

function toggleGUI(action) {
  showGUI = !showGUI;
  infoText = showGUI
    ? `Opened ${action} menu.`
    : "Hover over an action for details!";
  currentAction = showGUI ? action : "";
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

function alternateStats() {
  stats.overload =
    hidden_stats.hosts /
    (hidden_stats.hosts_limit - hosts_limit_constant) /
    hidden_stats.upgrade_level ** hidden_stats.attack_blocking_success_rate /
    10;
  stats.latency = stats.overload ** 1.25;
  stats.satisfaction = 1 - (stats.latency ** 2 + Math.sqrt(stats.latency) / 5);
  stats.money =
    hidden_stats.current_balance / hidden_stats.current_balance_limit;
}
