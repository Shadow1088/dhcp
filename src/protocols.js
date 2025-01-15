class ARP {
  constructor(sIP, dIP, sMAC, dMAC, nodeIndex, interfaceMAC, state) {
    this.sIP = sIP;
    this.dIP = dIP;
    this.sMAC = sMAC;
    this.dMAC = dMAC;
    this.receiverMethods = [this.updateReceiverFIB];
    this.targetMethods = [this.sendReply];
    this.nodeIndex = nodeIndex;
    this.interfaceMAC = interfaceMAC;
    this.state = state;
  }

  updateReceiverFIB() {
    nodes[nodeIndex].FIB[interfaceMAC] = sIP;
  }

  sendReply() {
    nodes[nodeIndex].receivedFrames.push(
      new Frame(this.dIP, this.sIP, this.dMAC, this.sMAC, null, new ARP()),
    );
  }
}
