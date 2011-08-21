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
  this.hangoutTitleID = '.hangout-greenroom-title';
  this.retryDelay = 1000;
  this.timeoutHandleRenderer = null;
  this.timeoutHandleClick = null;
  this.tryAgainButton = null;
};

/**
 * Initializes the autoclick feature.
 */
HangoutInjection.prototype.init = function() {
  this.timeoutHandleRenderer = setTimeout(this.renderAutoButton.bind(this), this.retryDelay);
};

/**
 * Find the hangout button given the name on the navigation bar. This will do some autodiscovery.
 *
 * @param {string} buttonName The button to find on the bar.
 */
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
    
    var developedBy = document.createElement('div');
    developedBy.style = 'color: red; font-size: 0.8em';
    developedBy.innerHTML = 'Developed by <a target="_blank" href="https://plus.google.com/116805285176805120365/about">+Mohamed Mansour</a>!';
    document.querySelector(this.hangoutTitleID).appendChild(developedBy);
    clearTimeout(this.timeoutHandleRenderer);
  }
  else { // Retry renderer.
    this.timeoutHandleRenderer = setTimeout(this.renderAutoButton.bind(this), this.retryDelay);
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
  this.timeoutHandleClick = setTimeout(this.autoClick.bind(this), this.retryDelay);
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