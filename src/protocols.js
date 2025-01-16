class ARP extends Protocol {
  constructor(state) {
    this.receiverMethods = [this.updateReceiverFIB];
    this.targetMethods = [this.sendReply];
    this.state = state;
  }

  updateReceiverFIB() {
    nodes[nodeIndex].FIB[interfaceMAC] = sIP;
  }

  sendReply() {
    nodes[nodeIndex].receivedFrames.push(
      new Frame(
        this.dIP,
        this.sIP,
        this.dMAC,
        this.sMAC,
        null,
        new ARP("reply"),
      ),
    );
  }
}
