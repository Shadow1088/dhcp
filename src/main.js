function setup() {
  createCanvas(windowWidth, windowHeight);
  SCENES["active"] = "mainscreen";
  SCENES["mainscreen"] = new MainScreen("mainscreen");
  SCENES["challengePicker"] = new ChallengePicker("challengepicker");
  SCENES["creation"] = new Creation();
  SCENES["challenge"] = new Challenge();
}

function draw() {
  iteration = iteration < 1000 ? iteration + 1 : 0;
  challengebgnum = challengebg() ? challengebgnum - 1 : challengebgnum + 1;

  action =
    drawgui != null
      ? "gui"
      : tempnode != null
        ? "placing"
        : action == "moving"
          ? "moving"
          : action == "deleting"
            ? "deleting"
            : action == "connecting"
              ? "connecting"
              : null;

  SCENES[SCENES["active"]].draw();

  if (tempconn) {
    tempconn.x2 = mouseX;
    tempconn.y2 = mouseY;
    tempconn.draw();
  }

  for (let i = 0; i < buttons.length; i++) {
    buttons[i].draw();
  }

  if (tempnode) {
    tempnode.draw();
    tempnode.update();
  }

  if (drawgui != null) {
    drawgui();
    for (let i = 0; i < guibuttons.length; i++) {
      guibuttons[i].draw();
    }
  }
  if (nodes.length) {
    for (let i = 0; i < nodes.length; i++) {
      nodes[i].draw();
    }
  }

  if (action == "moving") {
    for (
      let i = 0;
      i < Object.keys(nodes[selectedNode].interfaces).length;
      i++
    ) {
      let mac = Object.keys(nodes[selectedNode].interfaces)[i];
      let conn = nodes[selectedNode].interfaces[mac];
      const key = Object.keys(connections).find((k) => connections[k] === conn); // Find the key for the connection

      if (
        nodes[selectedNode].x == conn.x1 &&
        nodes[selectedNode].y == conn.y1
      ) {
        connections[key].x2 = mouseX;
        connections[key].y2 = mouseY;
        conn.x2 = mouseX;
        conn.y2 = mouseY;
      } else if (
        nodes[selectedNode].x == conn.x2 &&
        nodes[selectedNode].y == conn.y2
      ) {
        connections[key].x1 = mouseX;
        connections[key].y1 = mouseY;
        conn.x1 = mouseX;
        conn.y1 = mouseY;
      }
    }
    nodes[selectedNode].x = mouseX;
    nodes[selectedNode].y = mouseY;
  }
  for (let i = 0; i < connections.length; i++) {
    connections[i].draw();
  }
}

function mouseClicked() {
  if (tempnode) {
    tempnode.finished = true;
  }

  if (action == "deleting") {
    selectedNode = selectNode(mouseX, mouseY);
    if (selectedNode != -1) {
      deleteNode(selectedNode);
      action = null;
    }
  }
  if (action == "connecting") {
    if (tempconn) {
      selectedNode = nodes[selectNode(mouseX, mouseY)];

      let conn = new Connection(
        tempconn.x1,
        tempconn.y1,
        selectedNode.x,
        selectedNode.y,
      );
      connections.push(conn);
      addNodeConnection(selectedNode, connections.slice(-1)[0]);
      addNodeConnection(tempconnnode, connections.slice(-1)[0]);

      tempconnnode = null;
      tempconn = null;
      action = null;
    } else {
      selectedNode = nodes[selectNode(mouseX, mouseY)];
      tempconnnode = selectedNode;
      tempconn = new Connection(selectedNode.x, selectedNode.y, mouseX, mouseY);
    }
  }

  // check if a button was clicked
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].handleClick();
  }

  for (let i = 0; i < guibuttons.length; i++) {
    guibuttons[i].handleClick();
  }
}

function mousePressed() {
  if (action == null) {
    selectedNode = selectNode(mouseX, mouseY);
    if (selectedNode != -1) {
      action = "moving";
    }
  }
}

function mouseReleased() {
  if (action == "moving") {
    action = null;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
