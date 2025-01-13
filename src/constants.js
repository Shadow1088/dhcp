const MODES = {};

const STATES = {};

const IMAGES = {
  creationaddbutton: null,
  client: null,
  creationconnectbutton: null,
  creationdeletebutton: null,
  router: null,
  server: null,
  simulate: null,
  switchL2: null,
  switchL3: null,
  upgrade: null,
  mainscreen: null,
  switchtochallengepicker: null,
  challengepicker: null,
  challengebutton: null,
};

const SCENES = {};

const NodeTypes = {
  SERVER: "server",
  ROUTER: "router",
  SWITCH2: "switchL2",
  SWITCH3: "switchL3",
  CLIENT: "client",
};

let buttons = [];

let iteration = 0;
let challengebgnum = 1;
let challengebgmoving = false;
let circlePositions = [];

let tempnode = null;
let drawgui = null;
let guibuttons = [];

let nodes = [];

// if drawgui isnt null action = "gui", else if drawgui is null and tempnode isnt null then action="placing", else action="null"
let action = null;
