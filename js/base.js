/**
 * Base class that everyone shares.
 *
 * @author Mohamed Mansour 2011 (http://mohamedmansour.com)
 */

/**
 * Short form for getting elements by id.
 * @param {string} id The id.
 */
function $(id) {
  return document.getElementById(id);
}

/**
 * Base namespace for the Hangout Library.
 *
 * @const
 */
var mo = mo || {};
mo.injection = mo.injection || {};

/**
 * Inherit the prototype methods from one constructor into another.
 * Borrowed from Closure Library.
 *
 * @param {Function} childCtor Child class.
 * @param {Function} parentCtor Parent class.
 */
mo.inherits = function(childCtor, parentCtor) {
  /** @constructor */
  function tempCtor() {};
  tempCtor.prototype = parentCtor.prototype;
  childCtor.superClass_ = parentCtor.prototype;
  childCtor.prototype = new tempCtor();
  childCtor.prototype.constructor = childCtor;
};
