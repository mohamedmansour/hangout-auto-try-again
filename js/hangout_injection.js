/**
 * The injection responsible to inject the auto retry mechanism
 * for the try again.
 *
 * @author Mohamed Mansour 2011 (http://mohamedmansour.com)
 * @constructor
 */
HangoutInjection = function() {
  this.hangoutButtonBarID = '.hangout-greenroom-buttonbar';
  this.tryagainButtonID = ':oa'; // TODO: instead of relying on an ID, search for "Try Again"
  this.tryagainAlternateButtonID = ':o9';
  this.retryTryAgainDelay = 5000;
  this.retryRenderDelay = 1000;
  this.timeoutHandle = null;
};

/**
 * Initializes the autoclick feature.
 */
HangoutInjection.prototype.init = function() {
  chrome.extension.sendRequest({method: 'GetRetryDelay'},
      this.onRetryDelayReceived.bind(this));
  chrome.extension.onRequest.addListener(this.onExtensionRequest.bind(this));
  this.timeoutHandle = setTimeout(this.renderAutoButton.bind(this), this.retryRenderDelay);
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

/**
 * Auto retry again button renderer.
 */
HangoutInjection.prototype.renderAutoButton = function() {
  var hangoutButtonBar = document.querySelector(this.hangoutButtonBarID);
  var hangoutButton = $(this.tryagainButtonID);
  if (hangoutButton && hangoutButton.innerText != 'Try again') {
    hangoutButton = $(this.tryagainAlternateButtonID);
  }
  if (hangoutButton && hangoutButton.style.display != 'none') {
    var autoRetry = hangoutButton.cloneNode(true);
    autoRetry.id = ':oauto';
    autoRetry.innerHTML = 'Attempt Auto-Retry?';
    autoRetry.addEventListener('click', this.onAutoRetryClick.bind(this), false);
    hangoutButtonBar.appendChild(autoRetry);
    clearTimeout(this.timeoutHandle);
  }
  else { // Retry renderer
    this.timeoutHandle = setTimeout(this.renderAutoButton.bind(this), this.retryRenderDelay);
  }
};

/**
 * Event when the hangout button was clicked. It will attempt to retry.
 */
HangoutInjection.prototype.onAutoRetryClick = function(e) {
  this.autoClick();
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
  var clickEvent = document.createEvent('MouseEvents');
  clickEvent.initEvent('mousedown', true, true);
  element.dispatchEvent(clickEvent);
  
  clickEvent = document.createEvent('MouseEvents')
  clickEvent.initEvent('click', true, true);
  element.dispatchEvent(clickEvent);
  
  clickEvent = document.createEvent('MouseEvents')
  clickEvent.initEvent('mouseup', true, true);
  element.dispatchEvent(clickEvent);
};

/**
 * Auto click a specific div.
 */
HangoutInjection.prototype.autoClick = function() {
  var tryButton = $(this.tryagainButtonID);
  if (tryButton && tryButton.innerText != 'Try again') {
    tryButton = $(this.tryagainAlternateButtonID);
  }
  if (tryButton) {
     this.simulateClick(tryButton);
     setTimeout(this.autoClick.bind(this), this.retryTryAgainDelay);
  }
};

// Main.
var injection = new HangoutInjection();
injection.init();