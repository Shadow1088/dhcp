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

      if (conn.mac1 == mac) {
        conn.x1 = nodes[selectedNode].x1;
        conn.y1 = nodes[selectedNode].y1;
      } else if (conn.mac2 == mac) {
        conn.x2 = nodes[selectedNode].x2;
        conn.y2 = nodes[selectedNode].y2;
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
    let mac1 = generateMAC();
    let mac2 = generateMAC();
    if (tempconn) {
      selectedNode = nodes[selectNode(mouseX, mouseY)];

      let conn = new Connection(
        tempconn.x1,
        tempconn.y1,
        selectedNode.x,
        selectedNode.y,
        mac1,
        mac2,
      );
      connections.push(conn);
      addNodeConnection(selectedNode, mac2, connections.slice(-1)[0]);
      addNodeConnection(tempconnnode, mac1, connections.slice(-1)[0]);

      tempconnnode = null;
      tempconn = null;
      action = null;
    } else {
      selectedNode = nodes[selectNode(mouseX, mouseY)];
      tempconnnode = selectedNode;
      tempconn = new Connection(
        selectedNode.x,
        selectedNode.y,
        mouseX,
        mouseY,
        mac1,
        mac2,
      );
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
