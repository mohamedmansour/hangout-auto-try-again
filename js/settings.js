/** Global Settings.
 *
 * @author Mohamed Mansour 2011 (http://mohamedmansour.com)
 */
settings = {
  get version() {
    return localStorage['version'];
  },
  set version(val) {
    localStorage['version'] = val;
  },
  get opt_out() {
    var key = localStorage['opt_out'];
    return (typeof key == 'undefined') ? false : key === 'true';
  },
  set opt_out(val) {
    localStorage['opt_out'] = val;
  },
  get retry_delay() {
    var key = localStorage['retry_delay'];
    var delay = (typeof key == 'undefined') ? 5000 : parseInt(key);
    if (delay < 5000) {
      delay = 5000;
      localStorage['retry_delay'] = 5000;
    }
    return delay;
  },
  set retry_delay(val) {
    localStorage['retry_delay'] = val;
  },
  get chat_sound() {
    var key = localStorage['chat_sound'];
    return (typeof key == 'undefined') ? true : key === 'true';
  },
  set chat_sound(val) {
    localStorage['chat_sound'] = val;
  },
};