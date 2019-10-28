/**
 * This self executing function injects and runs 'content.js'. The purpose of
 * this injected script is to overload RTCPeerConnection to keep a globally
 * available reference of all created the RTCPeerConnections, in order to
 * perform stats gathering (using RTCPeerConnection.getStats).
 */
(function() {
  const script = document.createElement('script');
  script.setAttribute('type', 'text/javascript');
  script.setAttribute('src', chrome.extension.getURL('content.js'));
  (document.head || document.documentElement).appendChild(script);
})()