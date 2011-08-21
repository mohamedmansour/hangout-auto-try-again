/**
 * The injection responsible to inject the auto retry mechanism
 * for the try again.
 *
 * @author Mohamed Mansour 2011 (http://mohamedmansour.com)
 * @constructor
 */
HangoutInjection = function() {
  this.hangoutButtonBarID = '.hangout-greenroom-buttonbar';
  this.hangoutMessageID = '.hangout-greenroom-message';
  this.retryTryAgainDelay = 5000;
  this.retryRenderDelay = 1000;
  this.timeoutHandleRenderer = null;
  this.timeoutHandleClick = null;
  this.tryAgainButton = null;
};

/**
 * Initializes the autoclick feature.
 */
HangoutInjection.prototype.init = function() {
  chrome.extension.sendRequest({method: 'GetRetryDelay'}, this.onRetryDelayReceived.bind(this));
  chrome.extension.onRequest.addListener(this.onExtensionRequest.bind(this));
  this.timeoutHandleRenderer = setTimeout(this.renderAutoButton.bind(this), this.retryRenderDelay);
};

/**
 * Listen for some requests coming from the extension.
 *
 * @param {Object} request The request sent by the calling script.
 * @param {Object<MessageSender>} sender The location where the script has spawned.
 * @param {Function} request Function to call when you have a response. The 
                              argument should be any JSON-ifiable object, or
                              undefined if there is no response.
 */
HangoutInjection.prototype.onExtensionRequest = function(request, sender, sendResponse) {
  if (request.method == 'UpdateDelay') {
    this.onRetryDelayReceived(request);
  }
  sendResponse({});
};

HangoutInjection.prototype.findHangoutButton = function(buttonName) {
  var hangoutButtonBar = document.querySelector(this.hangoutButtonBarID);
  if (hangoutButtonBar) {
    var hangoutButtons = hangoutButtonBar.childNodes;
    for (var i = 0; i < hangoutButtons.length; i++) {
      var hangoutButton = hangoutButtons[i];
      if (hangoutButton.style.display != 'none' && hangoutButton.innerHTML == buttonName) {
        return hangoutButton;
      }
    }
  }
  return null;
};

/**
 * Auto retry again button renderer.
 */
HangoutInjection.prototype.renderAutoButton = function() {
  // Try to find the "Try Again" button.
  this.tryAgainButton = this.findHangoutButton('Try again');
  if (this.tryAgainButton) {
    var autoRetry = this.tryAgainButton.cloneNode(true);
    autoRetry.id = ':oauto';
    autoRetry.innerHTML = 'Attempt Auto-Retry?';
    autoRetry.addEventListener('click', this.onAutoRetryClick.bind(this), false);
    this.tryAgainButton.parentNode.appendChild(autoRetry);
    clearTimeout(this.timeoutHandleRenderer);
  }
  else { // Retry renderer
    this.timeoutHandleRenderer = setTimeout(this.renderAutoButton.bind(this), this.retryRenderDelay);
  }
};

/**
 * Event when the hangout button was clicked. It will attempt to retry.
 */
HangoutInjection.prototype.onAutoRetryClick = function(e) {
  this.autoClick(e);
};

/**
 * Event when the auto retry setting received.
 * @param {object} response The response packet.
 */
HangoutInjection.prototype.onRetryDelayReceived = function(response) {
  this.retryTryAgainDelay = response.data;
};

/**
 * Simulate a full click event on a specific element.
 * @param {HTMLElement} element the element to click.
 */
HangoutInjection.prototype.simulateClick = function(element) {
  var dispatchEvent = function (elt, name) {
    var clickEvent = document.createEvent('MouseEvents');
    clickEvent.initEvent(name, true, true);
    elt.dispatchEvent(clickEvent);
  };
  dispatchEvent(element, 'mouseover');
  dispatchEvent(element, 'mousedown');
  dispatchEvent(element, 'click');
  dispatchEvent(element, 'mouseup');
};

/**
 * Auto click a specific div.
 */
HangoutInjection.prototype.autoClick = function(e) {
  if (!this.isJoining()) {
    this.simulateClick(this.tryAgainButton);
  }
  this.timeoutHandleClick = setTimeout(this.autoClick.bind(this), 1000);
};

/**
 * Check if the joining text is appearing, this will stall.
 */
HangoutInjection.prototype.isJoining = function() {
  var message = document.querySelector(this.hangoutMessageID);
  return message.innerHTML == 'Joining the hangout...';
};

// Main.
var injection = new HangoutInjection();
injection.init();