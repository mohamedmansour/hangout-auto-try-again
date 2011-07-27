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
    return (typeof key == 'undefined') ? 2000 : parseInt(key);
  },
  set retry_delay(val) {
    localStorage['retry_delay'] = val;
  },
};