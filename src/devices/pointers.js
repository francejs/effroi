function Pointers () {

  // Neeed mouse to perform click
  var mouse = require('./mouse.js');
  var utils = require('../utils.js');

  // Private vars
  var _prefixed = !!window.navigator.msPointerEnabled;

  /**
  * Indicates if pointer events are available
  *
  * @return Boolean
  */
  this.isConnected = function () {
    return _prefixed || window.navigator.pointerEnabled;
  };

  /**
  * Perform a real pointer "click" on the given DOM element.
  *
  * @param  DOMElement  element   A DOMElement to point
  * @param  Object      options   Point options
  * @return Boolean
  */
  this.point = function (element, options) {
    options=options||{};
    options.type= 'pointerdown';
    dispatched=this.dispatch(element, options);
    options.type= 'pointerup';
    // IE10 trigger the click event even if the pointer event is cancelled
    // IE11+ fixed the issue and unprefixed pointer events.
    if((this.dispatch(element, options)&&dispatched) || _prefixed) {
      options.type='click';
      return mouse.dispatch(element, options);
    }
    return false;
  };

  /**
  * Dispatches a pointer event to the given DOM element.
  *
  * @param  DOMElement  element   A DOMElement on wich to dispatch the event
  * @param  Object      options   Event options
  * @return Boolean
  */
  this.dispatch = function(element,options) {
    options=options||{};
    var event = document.createEvent((_prefixed ? 'MS' : '') + 'PointerEvent');
    utils.setEventCoords(event, element);
    event.initPointerEvent(
      _prefixed ? 'MSPointer' + options.type[7].toUpperCase()
        + options.type.substring(8) : options.type,
      'false' === options.canBubble ? false : true,
      'false' === options.cancelable ? false : true,
      options.view||window,
      options.detail||1,
      options.screenX||0, options.screenY||0,
      options.clientX||0, options.clientY||0,
      !!options.ctrlKey, !!options.altKey,
      !!options.shiftKey, !!options.metaKey,
      options.button|1, options.relatedTarget||element,
      options.offsetX||0, options.offsetY||0,
      options.width||1, options.height||1,
      options.pressure||255, options.rotation||0,
      options.tiltX||0, options.tiltY||0,
      options.pointerId||1, options.pointerType||'mouse',
      options.hwTimestamp||Date.now(), options.isPrimary||true);
    return element.dispatchEvent(event);
  };

}

module.exports = new Pointers();
