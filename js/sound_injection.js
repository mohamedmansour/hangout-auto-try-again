/**
 * The injection responsible to inject the auto retry mechanism
 * for the try again.
 *
 * @author Mohamed Mansour 2011 (http://mohamedmansour.com)
 * @constructor
 */
SoundInjection = function() {
  this.disableSound = false;
  this.soundFrame = null;
};

/**
 * Initializes the autoclick feature.
 */
SoundInjection.prototype.init = function() {
  chrome.extension.sendRequest({method: 'GetSoundSettings'}, this.onSettingsReceived.bind(this));
  chrome.extension.onRequest.addListener(this.onExtensionRequest.bind(this));
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
SoundInjection.prototype.onExtensionRequest = function(request, sender, sendResponse) {
  if (request.method == 'UpdateSound') {
    this.onSettingsReceived(request);
  }
  sendResponse({});
};

/**
 * Event when the auto retry setting received.
 * @param {object} response The response packet.
 */
SoundInjection.prototype.onSettingsReceived = function(response) {
  this.disableSound = response.data;
  if (disableSound) {
    var currentSound = this.getSoundFrame();
    if (currentSound) {
      this.soundFrame = currentSound.parentNode.removeChild(currentSound);
    }
  }
  else {
    var currentSound = this.getSoundFrame();
    if (!currentSound) {
      document.body.appendChild(currentSound);
    }
  }
};

/**
 * @param {boolean} The sound frame containing the flash plugin for the sound.
 */
SoundInjection.prototype.getSoundFrame = function() {
  return document.getElementById('sound_frame');
};

// Main.
var injection = new SoundInjection();
injection.init();