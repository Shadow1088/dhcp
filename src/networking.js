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

// simulates plugging cable into an interface
function addNodeConnection(node, mac, connection) {
  node.interfaces[mac] = connection;
  node.FIB[mac] = null;
}

class Connection {
  constructor(x1, y1, x2, y2, mac1, mac2) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.mac1 = mac1;
    this.mac2 = mac2;
  }
  draw() {
    push();

    stroke("orange");

    line(this.x1, this.y1, this.x2, this.y2);

    pop();
  }
}

class Frame {
  constructor(protocol) {
    this.sIP = protocol.sIP;
    this.dIP = protocol.dIP;
    this.sMAC = protocol.sMAC;
    this.dMAC = protocol.dMAC;
    this.interfaceMAC = protocol.interfaceMAC;
    this.protocol = protocol;
    this.hops = 0;
    this.ttl = 20; // Time To Live
  }
}

class Protocol {
  constructor(sIP, dIP, sMAC, dMAC, nodeIndex, interfaceMAC) {
    this.sIP = sIP;
    this.dIP = dIP;
    this.sMAC = sMAC;
    this.dMAC = dMAC;
    this.nodeIndex = nodeIndex;
    this.interfaceMAC = interfaceMAC;
  }
}

function forwardFrame(nodeIndex, type, frame) {
  let node = nodes[nodeIndex];
  let target = type == "broadcast" ? "FF-FF-FF-FF-FF-FF" : frame.dMAC;
}
