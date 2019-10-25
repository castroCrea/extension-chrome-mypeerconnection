if (window.location.hostname !== 'viewer.staging-5em2ouy-wwdx6yz432y36.eu-2.platformsh.site' && window.location.hostname !== 'viewer.bonjour.io') {
  let origPeerConnection = window.RTCPeerConnection;
  window.myPeerConnections = [];

  /**
   * In order to keep this code as simple as possible, we push RTCPeerConnection
   * objects to a global array whenever they are instanciated. This allows us to
   * call the original 'getStats' function on every RTCPeerConnection we find in
   * this array.
   */
  if (origPeerConnection) {
    let newPeerConnection = function(configuration) {
      console.log('new PeerCo')
      const pc = new origPeerConnection(configuration);

      window.myPeerConnections.push(pc);

      return pc;
    };

    window.RTCPeerConnection = newPeerConnection;
    Object.keys(origPeerConnection).forEach(x => {
      window.RTCPeerConnection[x] = origPeerConnection[x];
    });
    window.RTCPeerConnection.prototype = origPeerConnection.prototype;
  }
}

myGetStats = () => {
  window.myPeerConnections.forEach((pc) => {
    if (pc.connectionState !== 'connected') {
      return;
    }
    pc.getStats().then((reports) => {
      let type = null;
      switch (pc.localDescription.type) {
        case 'offer':
          console.log('---- Publisher -----');
          type = 'publisher';
          break;
        case 'answer':
          console.log('---- Subscriber -----');
          type = 'subscriber';
          break;
        default:
          break;
      }
      reports.forEach((report) => {
        switch(report.type) {
          case 'outbound-rtp':
            console.log('[' + type + ']' + '[outbound-rtp][' + report.mediaType + '] packetsSent :', report.packetsSent);
            console.log('[' + type + ']' + '[outbound-rtp][' + report.mediaType + '] retransmittedPacketsSent :', report.retransmittedPacketsSent);
            break;
          case 'inbound-rtp':
            console.log('[' + type + ']' + '[inbound-rtp][' + report.mediaType + '] packetsLost :', report.packetsLost);
            console.log('[' + type + ']' + '[inbound-rtp][' + report.mediaType + '] packetsReceived :', report.packetsReceived);
            break;
          case 'remote-inbound-rtp':
            console.log('[' + type + ']' + '[remote-inbound-rtp][' + report.kind + '] packetsLost :', report.packetsLost);
            console.log('[' + type + ']' + '[remote-inbound-rtp][' + report.kind + '] roundTripTime :', report.roundTripTime);
            break;
          case 'candidate-pair':
            console.log('[' + type + ']' + '[candidate-pair] currentRoundTripTime :', report.currentRoundTripTime);
            break;
          default:
            break;
        }
      });
    });
  })
}