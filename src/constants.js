const TOPICS = {};

const MODES = {};

const STATES = {};

const IMAGES = {
  buy: null,
  client: null,
  connect: null,
  delete: null,
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
  SWITCH2: "switch2",
  SWITCH3: "switch3",
  CLIENT: "client",
};

let buttons = [];

let iteration = 0;
let challengebgnum = 1;
let challengebgmoving = false;
let circlePositions = [];
