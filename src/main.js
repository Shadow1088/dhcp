/// <reference path="../node_modules/@types/p5/global.d.ts" />

////// global variables ///////
// array's with all existing objects
const buttons = [];
const nodes = [];
const connections = [];
const nodeImages = {};
// top bar's text informing what do buttons do or what you are meant to do
let infoText = "Hover over an action for details!";
// tells if you are currently in a GUI interface
let showGUI = false;
// if you have bought just now a node and still hover with it its equal to its type
let currentHoverType = "";
// toggleGUI required parameter - basically what are you doing within the sidebar
let currentAction = "";
// account network and broadcast address into total hosts limit
let hosts_limit_constant = 2;
// tells if you are currently placing a node
let isPlacingNode = false;
// tells if you are currently connecting devices
let connecting = false;
// variable required for connecting nodes - helps drawing a connection line while incomplete connection and
let firstNode = null;
// tells if you are currently moving a node
let moving = false;

let upgrading = false;
// speed of passing frames - x seconds per frame pass
let speed = 1.5;

let iteration = 0;

// each "important to see" field's status
const stats = {
  overload: 0.7,
  latency: 0.01,
  satisfaction: 0.85,
  money: 0.5,
};

// stats that are not needed to be displayed
const hidden_stats = {
  attack_blocking_success_rate: 1,
  upgrade_level: 0.1,
  hosts_limit: 4,
  hosts: nodes.length,
  current_balance: 1000,
  current_balance_limit: 1000,
  baseNodeLevel: 1,
};

// node types
const NodeTypes = {
  SERVER: "server",
  ROUTER: "router",
  SWITCH2: "switch2",
  SWITCH3: "switch3",
  CLIENT: "client",
};

// simplyfied Frame
class Frame {
  constructor(dMAC, sMAC, dIP, sIP, protocol, vlan) {
    this.dMAC = dMAC;
    this.sMAC = sMAC;
    this.dIP = dIP;
    this.sIP = sIP;
    this.direction = "in";
    this.protocol = protocol;
    this.vlan = vlan;
  }
}

class Interface {
  constructor(prefix, id, mac, state, connection) {
    this.prefix = prefix;
    this.id = id;
    this.mac = mac;
    this.state = state;
  }
}

// node class - represents every node
class Node {
  constructor(x, y, type, level) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.img = nodeImages[type];
    this.level = level;
    this.frameLimit = 10 * this.level;
    this.frames = [];
    this.connections = []; // array with neighbor mac addresses
    this.connectionsLimit = 4;
    this.mac = generateMAC();
    this.prefix = "";
    this.FIB = {};
    this.dragged = false;
  }

  draw() {
    imageMode(CENTER);
    image(this.img, this.x, this.y, 40, 40);

    textSize(12);
    textAlign("center");
    text(`Level ${this.level}`, this.x, this.y + 25);
    text(this.mac, this.x, this.y + 45);
  }

  addConnection(connection) {
    this.connections[this.connections.length] = new Interface(this.prefix);
  }

  changePrefix() {
    switch (this.type) {
      case "router":
        null;
    }
  } // TODO: Finish later interfaces and conenctions array

  arp() {
    this.connections.forEach((connection, i) => {
      if (connection.node1mac != this.mac) {
        if (
          (this.type == "switch2" || this.type == "server") &&
          this.level < 5
        ) {
          this.prefix = "fa";
          this.FIB[`${this.prefix}0/${i}`] = connection.node1mac;
        } else {
          this.prefix = "g";
          this.FIB[`${this.prefix}0/${i}`] = connection.node1mac;
        }
      } else {
        if (
          (this.type == "switch2" || this.type == "server") &&
          this.level < 5
        ) {
          this.prefix = "fa";
          this.FIB[`${this.prefix}0/${i}`] = connection.node2mac;
        } else {
          this.prefix = "g";
          this.FIB[`${this.prefix}0/${i}`] = connection.node2mac;
        }
      }
    });
    //console.log(`MAC table for ${this.mac}:`, this.FIB);
  }

  // goes through all Frames
  handleFrame(frame, index) {}

  forwardFrame() {}
}

// connection class - represents every connection
class Connection {
  constructor(node1, node2) {
    this.x1 = node1.x;
    this.y1 = node1.y;
    this.x2 = node2.x;
    this.y2 = node2.y;
    this.node1mac = node1.mac;
    this.node2mac = node2.mac;
  }
  draw() {
    stroke("orange");
    line(this.x1, this.y1, this.x2, this.y2);
    noStroke();
  }
  checkValidity() {}
}

// iconbutton class - basically every sidebar button
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

// P5 setup function - called just once
function setup() {
  createCanvas(1000, 700);
  initializeButtons();
  hidden_stats.hosts = nodes.length;
}

// P5 draw function - called right after setup, runs infinitely
function draw() {
  iteration = iteration < 1000 ? iteration + 1 : 0;
  // set canvas background color
  background(30);
  // change stats based on your performance
  alternateStats();
  // draw stat fields - status bar, percentage, title
  drawStatFields();
  // draw sidebar with buttons
  drawSidebar();
  // draw top bar with infoText
  drawInfoBar();
  // draw the playground
  drawMainCanvas();

  if (iteration % 200 == 0) {
    nodes.forEach((node) => {
      node.arp();
      node.connectionsLimit = calculateConnectionLimit(node.type, node.level);
    });
  }

  // draw node's image while its placing
  if (isPlacingNode && currentHoverType != "") {
    const tempNode = new Node(
      mouseX - 100,
      mouseY,
      currentHoverType,
      hidden_stats.baseNodeLevel,
    );
    push();
    translate(100, 0);
    tempNode.draw();
    pop();

    stroke(255, 0, 0, 150);
    noFill();
    ellipse(mouseX, mouseY, 60, 60);
    noStroke();
  }

  // draw line while unfinished connecting
  if (connecting && firstNode) {
    push();

    translate(100, 0);
    stroke("orange");
    line(firstNode.x, firstNode.y, mouseX - 100, mouseY);

    pop();
  }

  // if showGUI is true, draw basic GUI interface and draw the GUI type
  if (showGUI) {
    drawGUIinterface();
    if (currentAction === "buy") drawBuyGUI();
  }
}

// load all images
function preload() {
  Object.values(NodeTypes).forEach((type) => {
    nodeImages[type] = loadImage(`../img/${type}.png`);
  });
}

function calculateConnectionLimit(type, level) {
  if (type != "router") {
    if (type == "client") {
      return 1;
    }
    return 4 * level;
  } else {
    return 4;
  }
}

function generateMAC() {
  const hex = "0123456789ABCDEF";
  let output = "";
  for (let i = 0; i < 12; ++i) {
    output += hex.charAt(Math.floor(Math.random() * hex.length));
    if ((i % 2) - 1 == 0 && i < 10) {
      output += "-";
    }
  }
  return output;
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

// sidebar buttons
function initializeButtons() {
  buttons.push(
    new IconButton(20, 100, "buy", "Buy new node", () => toggleGUI("buy")),
  );
  buttons.push(
    new IconButton(20, 160, "connect", "Connect two nodes", () => connect()),
  );
  buttons.push(
    new IconButton(20, 220, "upgrade", "Increase node's level", () =>
      upgrade(),
    ),
  );
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

function drawGUIinterface() {
  fill(0, 150);
  rect(0, 0, width, height);
  fill("white");
  textSize(24);
  textAlign(CENTER, CENTER);
  text("GUI Overlay: Interact with Options", width / 2, height / 2);
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

// P5's built-in callback function - whenever you click P5 calls this function
function mousePressed() {
  // handles click -> if its hovevered and you click it executes its associated function
  buttons.forEach((button) => button.handleClick());

  // if hovering with the node you bought and you click, it places the node
  if (isPlacingNode && currentHoverType !== "" && mouseX > 100) {
    nodes.push(
      new Node(
        mouseX - 100,
        mouseY,
        currentHoverType,
        hidden_stats.baseNodeLevel,
      ),
    );
    hidden_stats.hosts = nodes.length;

    isPlacingNode = false;
    currentHoverType = "";
    showGUI = false;
  }

  // handles connecting nodes
  if (connecting) {
    // selects the node by returning its index in its array
    let selectedNodeIndex = selectNode(mouseX - 100, mouseY);
    if (
      selectedNodeIndex !== -1 &&
      nodes[selectedNodeIndex].connections.length >=
        nodes[selectedNodeIndex].connectionsLimit
    ) {
      infoText = "This node has reached its connection limit!";
      selectedNodeIndex = -1;
    }
    // if clicked on a node
    if (selectedNodeIndex != -1) {
      // if selecting second node
      if (!firstNode) {
        firstNode = nodes[selectedNodeIndex];
        infoText = "Select second node to connect";

        // if selecting first node
      } else {
        const secondNode = nodes[selectedNodeIndex];

        // if successful connection
        if (firstNode != secondNode) {
          const connection = new Connection(firstNode, secondNode);
          connections.push(connection);

          firstNode.addConnection(connection);
          secondNode.addConnection(connection);

          connecting = false;
          firstNode = null;
          infoText = "Connection created!";

          // if tried connecting to the same node
        } else {
          infoText = "Cannot connect node to itself!";
        }
      }
    }
  }
  if (upgrading) {
    const selectedNodeIndex = selectNode(mouseX - 100, mouseY);
    if (selectedNodeIndex != -1) {
      nodes[selectedNodeIndex].level += 1;
      upgrading = false;
    }
  }

  // if none of buttons selected and a node is selected we suppose user intends to drag the node
  if (!connecting && !upgrading && !isPlacingNode) {
    const selectedNodeIndex = selectNode(mouseX - 100, mouseY);
    if (selectedNodeIndex != -1) {
      moving = true;
      nodes[selectedNodeIndex].dragged = true;
    }
  }
}

function mouseDragged() {
  if (moving) {
    const draggedNode = nodes.find((node) => node.dragged);
    if (draggedNode) {
      const newX = mouseX - 100;
      const newY = mouseY;

      if (newX >= 30 && newX <= 870 && newY >= 30 && newY <= 670) {
        draggedNode.x = newX;
        draggedNode.y = newY;

        connections.forEach((conn) => {
          if (conn.node1mac === draggedNode.mac) {
            conn.x1 = draggedNode.x;
            conn.y1 = draggedNode.y;
          }
          if (conn.node2mac === draggedNode.mac) {
            conn.x2 = draggedNode.x;
            conn.y2 = draggedNode.y;
          }
        });
      }
    }
  }
}

function checkOutOfBounds() {}

function mouseReleased() {
  if (moving) {
    nodes.forEach((node) => (node.dragged = false));
    moving = false;
  }
}
// sets connection to true and displays a text
function connect() {
  connecting = true;
  infoText = "Select first node to connect";
}

// TODO: comment this func later
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
    { type: NodeTypes.CLIENT, cost: 50 },
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

// toggle showGUI and current action
function toggleGUI(action) {
  showGUI = !showGUI;
  infoText = showGUI
    ? `Opened ${action} menu.`
    : "Hover over an action for details!";
  currentAction = showGUI ? action : "";
}

function upgrade() {
  if (connecting == false && isPlacingNode == false) {
    upgrading = true;
    infoText = "Click a node to increase its level";
  }
}

function collectOverload() {
  let result = 0;

  nodes.forEach((node, i) => {
    result += nodes[i].frames.length / nodes[i].frameLimit;
  });
  return result;
}

// change your stats based on your performance via sophisticated formulas
function alternateStats() {
  stats.overload = collectOverload();
  stats.latency = stats.overload ** 1.25;
  stats.satisfaction = 1 - (stats.latency ** 2 + Math.sqrt(stats.latency) / 5);
  stats.money =
    hidden_stats.current_balance / hidden_stats.current_balance_limit;
}
