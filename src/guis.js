function addNodeGUI() {
  let w = 500;
  let gui_x = windowWidth / 2 - w / 2;
  let gui_y = windowHeight / 2 - w / 2;
  let gui_width = w + w / 3;
  let gui_height = w;
  addNodeGUIcreateChoices(gui_x, gui_y, gui_width, gui_height);
  push();
  fill(81, 81, 81, 40);
  rect(gui_x, gui_y, gui_width, gui_height);
  pop();
}

function addNodeGUIcreateChoices(gui_x, gui_y, gui_width, gui_height) {
  guibuttons = [];
  let len = Object.keys(NodeTypes).length; // amount of defined nodes
  let gap = 30;
  let size = 70; // icon size
  let row = Math.floor(gui_width / (size + gap)); // items per row

  for (let i = 0; i < len; i++) {
    let currentRow = Math.floor(i / row);
    let currentCol = i % row;

    let x = gui_x + gap + (size + gap) * currentCol + gap;
    let y = gui_y + gap + (size + gap) * currentRow + gap;

    if (y > gui_y + gui_height - size) {
      console.log("Scroll function non-existent");
      continue;
    }

    const button = new Button(
      x,
      y,
      size,
      size,
      NodeTypes[Object.keys(NodeTypes)[i]],
      () => tempNodeFunc(NodeTypes[Object.keys(NodeTypes)[i]]),
      "",
    );
    guibuttons.push(button);
  }
}
