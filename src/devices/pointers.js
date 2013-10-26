function Pointers () {

  // Neeed mouse to perform click
  var mouse = require('./mouse.js');
  var utils = require('../utils.js');

  // Consts
  // Buttons : http://msdn.microsoft.com/en-us/library/ie/ff974878(v=vs.85).aspx
  this.LEFT_BUTTON = 1;
  this.RIGHT_BUTTON = 2;
  this.MIDDLE_BUTTON = 4;
  this.BACK_BUTTON = 8;
  this.FORWARD_BUTTON = 16;
  this.PEN_ERASER_BUTTON = 32;
  this.BUTTONS_MASK = this.LEFT_BUTTON | this.RIGHT_BUTTON
    | this.MIDDLE_BUTTON | this.BACK_BUTTON | this.FORWARD_BUTTON
    | this.PEN_ERASER_BUTTON;
  // Pointer types : 
  this.MOUSE = 'mouse';
  this.PEN = 'pen';
  this.TOUCH = 'touch';
  this.UNKNOWN = '';

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
  * Perform a pen pointing on the given DOM element.
  *
  * @param  DOMElement  element   A DOMElement to point with the pen
  * @param  Object      options   Event options
  * @return Boolean
  */
  this.pen = function (element, options) {
    options = options||{};
    options.pointerType = this.PEN;
    options.buttons = this.LEFT_BUTTON;
    return this.point(element, options);
  };

  /**
  * Perform a touch on the given DOM element.
  *
  * @param  DOMElement  element   A DOMElement to touch
  * @param  Object      options   Event options
  * @return Boolean
  */
  this.touch = function (element, options) {
    options = options||{};
    options.pointerType = this.TOUCH;
    options.buttons = this.LEFT_BUTTON;
    return this.point(element, options);
  };

  /**
  * Perform a click on the given DOM element.
  *
  * @param  DOMElement  element   A DOMElement to point
  * @param  Object      options   Event options
  * @return Boolean
  */
  this.click = function (element, options) {
    options = options||{};
    options.pointerType = this.MOUSE;
    options.buttons = this.LEFT_BUTTON;
    return this.point(element, options);
  };

  /**
  * Perform a real full pointer "click" on the given DOM element.
  *
  * @param  DOMElement  element   A DOMElement to point
  * @param  Object      options   Point options
  * @return Boolean
  */
  this.point = function (element, options) {
    options = options||{};
    options.type = 'pointerdown';
    dispatched = this.dispatch(element, options);
    options.type = 'pointerup';
    dispatched = this.dispatch(element, options)&&dispatched;
    // IE10 trigger the click event even if the pointer event is cancelled
    // also, the click is a MouseEvent
    if(_prefixed) {
      options.type = 'click';
      return mouse.dispatch(element, options);
    // IE11+ fixed the issue and unprefixed pointer events.
    // The click is a PointerEvent
    } else if(dispatched) {
      options.type = 'click';
      return this.dispatch(element, options);
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
    var button, pointerType, event, coords;
    options = options || {};
    if(options.buttons !== options.buttons&this.BUTTONS_MASK) {
      throw Error('Bad value for the "buttons" property.');
    }
    options.buttons = options.buttons || this.LEFT_BUTTON;
    if(options.button) {
      throw Error('Please use the "buttons" property.');
    }
    if(options.buttons&this.LEFT_BUTTON) {
      button = 0;
    } else if(options.buttons&this.MIDDLE_BUTTON) {
      button = 1;
    } else if(options.buttons&this.RIGHT_BUTTON) {
      button = 2;
    } else if(options.buttons&this.BACK_BUTTON) {
      button = 3;
    } else if(options.buttons&this.FORWARD_BUTTON) {
      button = 4;
    } else if(options.buttons&this.PEN_ERASER_BUTTON) {
      button = 5;
    } else {
      button = -1;
    }
    options.pointerType = options.pointerType || this.UNKNOWN;
    // IE10 fix for pointer types
    // http://msdn.microsoft.com/en-us/library/ie/hh772359(v=vs.85).aspx
    if(_prefixed) {
      if(options.pointerType == this.MOUSE) {
        pointerType = 4;
      } else if(options.pointerType == this.TOUCH) {
        pointerType = 2;
      } else if(options.pointerType == this.PEN) {
        pointerType = 3;
      } else {
        pointerType = 0;
      }
    } else {
      pointerType = options.pointerType;
    }
    event = document.createEvent((_prefixed ? 'MS' : '') + 'PointerEvent');
    coords = utils.getPossiblePointerCoords(element);
    if(null===coords) {
      throw Error('Unable to find a point in the viewport at wich the given'
        +' element can receive a pointer event.');
    }
    utils.setEventCoords(event, element);
    event.initPointerEvent(
      _prefixed ? 'MSPointer' + options.type[7].toUpperCase()
        + options.type.substring(8) : options.type,
      'false' === options.canBubble ? false : true,
      'false' === options.cancelable ? false : true,
      options.view||window, options.detail||1,
      // Screen coordinates (relative to the whole user screen)
      // FIXME: find a way to get the right screen coordinates
      coords.x + window.screenLeft, coords.y  + window.screenTop,
      // Client coordinates (relative to the viewport)
      coords.x, coords.y,
      !!options.ctrlKey, !!options.altKey,
      !!options.shiftKey, !!options.metaKey,
      button, options.relatedTarget||element,
      options.offsetX||0, options.offsetY||0,
      options.width||1, options.height||1,
      options.pressure||255, options.rotation||0,
      options.tiltX||0, options.tiltY||0,
      options.pointerId||1, pointerType,
      options.hwTimestamp||Date.now(), options.isPrimary||true);
    utils.setEventProperty(event, 'buttons', options.buttons);
    utils.setEventProperty(event, 'pointerType', pointerType);
    return element.dispatchEvent(event);
  };

}

module.exports = new Pointers();
