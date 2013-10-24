!function(e){"object"==typeof exports?module.exports=e():"function"==typeof define&&define.amd?define(e):"undefined"!=typeof window?window.effroi=e():"undefined"!=typeof global?global.effroi=e():"undefined"!=typeof self&&(self.effroi=e())}(function(){var define,module,exports;
return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
function Keyboard() {

  var utils = require('../utils.js');
  var mouse = require('./mouse.js');

  // Consts
  this.ALT = 'Alt';
  this.ALT_GR = 'AltGraph';
  this.CAPS_LOCK = 'CapsLock';
  this.CTRL = 'Control';
  this.FN = 'Fn';
  this.META = 'Meta';
  this.NUM_LOCK = 'NumLock';
  this.SCROLL_LOCK = 'ScrollLock';  // Can be "Scroll" on IE9
  this.SHIFT = 'Shift';
  this.SYM_LOCK = 'SymbolLock';
  this.OS = 'OS'; // Can be "Win" on IE9

  // Private vars
  var _x = 1, _y = 1;

	this.hit = function (element,options) {
		var dispatched;
		options=options||{};
		options.type='keydown';
		dispatched=this.dispatch(element, options);
		if(dispatched&&options.keyCode
			&&String.fromCharCode(options.keyCode)
			&&('TEXTAREA'===element.nodeName
			||('INPUT'===element.nodeName&&element.hasAttribute('type')
				&&'text'===element.getAttribute('type')))) {
			element.value+=String.fromCharCode(options.charCode);
			utils.dispatch(element, {type: 'input'});
		}
		options.type='keyup';
		if(!(this.dispatch(element, options)||dispatched)) {
			return false;
		}
		options.type='keypress';
		return this.dispatch(element, options);
	};

  // Keyboard interactions : lack of a keymap between various keyCode/charCode
	// in different browsers
	this.dispatch = function (element,options) {
		var event, char, modifiers;
		options=options || {};
    options.canBubble = ('false' === options.canBubble ? false : true);
    options.cancelable = ('false' === options.cancelable ? false : true);
    options.view = options.view || window;
		options.ctrlKey = !!options.ctrlKey;
		options.altKey = !!options.altKey;
		options.shiftKey = !!options.shiftKey;
		options.metaKey = !!options.metaKey;
		options.keyCode = options.keyCode|0;
		options.charCode = options.charCode|0;
		options.repeat = !!options.repeat;
		options.location = options.location|0;
		options.modifier = options.modifier || '';
		options.locale = options.locale || '';
		char = String.fromCharCode(options.charCode);
		if(document.createEvent) {
			event = document.createEvent('KeyboardEvent');
			if(typeof event.initKeyboardEvent !== 'undefined') {
			  if(options.shiftKey) {
			    modifiers += this.SHIFT;
			  }
			  if(options.crtlKey) {
			    modifiers += (modifiers ? ' ' : '') + this.CTRL;
			  }
			  if(options.altKey) {
			    modifiers += (modifiers ? ' ' : '') + this.ALT;
			  }
			  if(options.metaKey) {
			    modifiers += (modifiers ? ' ' : '') + this.META;
			  }
				event.initKeyboardEvent(options.type,
				  'false' === options.canBubble ? false : true,
				  'false' === options.cancelable ? false : true,
				  options.view||window, char, options.charCode,
				  options.location, modifiers,
				  options.repeat, options.locale);
			} else {
			  event.initKeyEvent(options.type,
				'false' === options.canBubble ? false : true,
				'false' === options.cancelable ? false : true,
				options.view||window,
        options.ctrlKey, options.altKey, options.shiftKey, options.metaKey,
        options.charCode, options.charCode);
			}
      utils.setEventProperty(event, 'ctrlKey', options.ctrlKey);
      utils.setEventProperty(event, 'altKey', options.altKey);
      utils.setEventProperty(event, 'shiftKey', options.shiftKey);
      utils.setEventProperty(event, 'metaKey', options.metaKey);
      utils.setEventProperty(event, 'keyCode', options.charCode);
      utils.setEventProperty(event, 'which', options.keyCode);
      utils.setEventProperty(event, 'charCode', options.charCode);
      utils.setEventProperty(event, 'char', char);
			return element.dispatchEvent(event);
		} else if(document.createEventObject) {
			event = document.createEventObject();
			event.eventType = options.type;
      event.altKey = options.altKey;
      event.ctrlKey = options.ctrlKey;
      event.shiftKey = options.shiftKey;
      event.metaKey = options.metaKey;
			event.keyCode = options.charCode;
			event.charCode = options.charCode;
			event.char=char;
      return element.fireEvent('on'+options.type, event);
		}
	}

}

module.exports = new Keyboard();


},{"../utils.js":8,"./mouse.js":2}],2:[function(require,module,exports){
function Mouse() {

  var utils = require('../utils.js');

  // Consts
  this.LEFT_BUTTON = 1;
  this.RIGHT_BUTTON = 2;
  this.MIDDLE_BUTTON = 4;
  this.BACK_BUTTON = 8;
  this.FORWARD_BUTTON = 16;
  this.BUTTONS_MASK = this.LEFT_BUTTON | this.RIGHT_BUTTON
    | this.MIDDLE_BUTTON | this.BACK_BUTTON | this.FORWARD_BUTTON;

  // Private vars
  var _x = 1, _y = 1;

  /**
  * Select content like if it were done by a user with his mouse.
  *
  * @param  DOMElement  element   A DOMElement to dblclick
  * @param  Number      start     The selection start
  * @param  Number      end     The selection end
  * @return Boolean
  */
  this.select = function cut(element, start, end) {
    if(!utils.isSelectable(element)) {
      throw Error('Cannot select the element content.');
    }
    if(!start) {
      start = 0;
    } else if(start < 0 || start > element.value.length) {
      throw RangeError('Invalid selection start.');
    }
    if(!end) {
      end = element.value.length;
    } else if(end > element.value.length || end < start) {
      throw RangeError('Invalid selection end.');
    }
    // We move to the element if not over yet
    this.moveTo(element);
    // To select, we keep the mousedown over the input
    options = {};
    options.type = 'mousedown';
    // if the mousedown event is prevented we can't select content
    if(!this.dispatch(element, options)) {
      return false;
    }
    // We move over the selection to perform
    // FIXME: This should be done better with real coords
    options.type = 'mousemove';
    this.dispatch(element, options);
    // if the mouseup event is prevented the whole content is selected
    options.type = 'mouseup';
    if(!this.dispatch(element, options)) {
      end = element.value.length;
    }
    // finally selecting the content
    element.selectionStart = start;
    element.selectionEnd = end;
    return true;
  };

  /**
  * Cut selected content like if it were done by a user with his mouse.
  *
  * @param  DOMElement  element   A DOMElement to dblclick
  * @param  String      content   The content to paste
  * @return Boolean
  */
  this.cut = function cut(element) {
    var content;
    // We move to the element if not over yet
    this.moveTo(element);
    // To cut, we right-click but only the mousedown is fired due to the
    // contextual menu that appears
    options = {};
    options.type = 'mousedown';
    // if the mousedown event is prevented we can't cut content
    if(!this.dispatch(element, options)) {
      return '';
    }
    // if content is selectable, we cut only the selected content
    if(utils.isSelectable(element)) {
      content = element.value.substr(element.selectionStart, element.selectionEnd-1);
      element.value =
        (element.selectionStart ?
          element.value.substr(0, element.selectionStart) : '')
        + (element.selectionEnd ?
          element.value.substr(element.selectionEnd) :
          '');
    // otherwise we cut the full content
    } else {
      content = element.value;
      element.value = null;
    }
    // finally firing an input event
    utils.dispatch(element, {type: 'input'});
    return content;
  };

  /**
  * Paste content like if it were done by a user with his mouse.
  *
  * @param  DOMElement  element   A DOMElement to dblclick
  * @param  String      content   The content to paste
  * @return Boolean
  */
  this.paste = function paste(element, content) {
    // The content of a paste is always a string
    if('string' !== typeof content) {
      throw Error('Can only paste strings (received '+(typeof content)+').');
    }
    if(!utils.canAcceptContent(element, content)) {
      throw Error('Unable to paste content in the given element.');
    }
    // We move to the element if not over yet
    this.moveTo(element);
    options = {};
    options.type = 'mousedown';
    // if the mousedown event is prevented we can't paste content
    if(!this.dispatch(element, options)) {
      return false;
    }
    // if content is selectable, we paste content in the place of the selected content
    if(utils.isSelectable(element)) {
      element.value =
        (element.selectionStart ?
          element.value.substr(0, element.selectionStart) : '')
        + content
        + (element.selectionEnd ?
          element.value.substr(element.selectionEnd) :
          '');
    // otherwise we just replace the value
    } else {
      element.value = content;
    }
    // finally firing an input event
    return utils.dispatch(element, {type: 'input'});
  };

  /**
  * Perform a real mouse double click on the given DOM element.
  *
  * @param  DOMElement  element   A DOMElement to dblclick
  * @param  Object      options   Clic options
  * @return Boolean
  */
  this.dblclick = function dblclick(element, options) {
    var dispatched;
    // We move to the element if not over yet
    this.moveTo(element);
    options = options||{};
    dispatched = this.click(element, options);
    if(!(this.click(element, options)&&dispatched)) {
      return false;
    }
    options.type = 'dblclick';
    return this.dispatch(element, options);
  };

  /**
  * Perform a real mouse rightclick on the given DOM element.
  *
  * @param  DOMElement  element   A DOMElement to rightclick
  * @param  Object      options   Clic options
  * @return Boolean
  */
  this.rightclick = function rightclick(element, options) {
    options = options || {};
    options.buttons = this.RIGHT_BUTTON;
    return this.click(element, options);
  };

  /**
  * Perform a real mouse click on the given DOM element.
  *
  * @param  DOMElement  element   A DOMElement to click
  * @param  Object      options   Clic options
  * @return Boolean
  */
  this.click = function click(element, options) {
    var dispatched;
    // We move to the element if not over yet
    this.moveTo(element);
    options = options || {};
    options.type = 'mousedown';
    dispatched = this.dispatch(element, options);
    options.type = 'mouseup';
    if(!(this.dispatch(element, options)&&dispatched)) {
      return false;
    }
    options.type = 'click';
    return this.dispatch(element, options);
  };

  /**
  * Focus a DOM element with the mouse.
  *
  * @param  DOMElement  element   A DOMElement to focus
  * @param  Object      options   Event options
  * @return Boolean
  */
  this.focus = function focus(element, options) {
    var dispatched, focusEventFired=false;
    // We move to the element if not over yet
    this.moveTo(element);
    options = options || {};
    options.type = 'mousedown';
    dispatched=this.dispatch(element, options);
    // Here, maybe find the first parent element having greater bound rect
    // and move on it's focusable zone or fail if none available
    this.moveTo(element.parentNode);
    options.type = 'mouseup';
    this.dispatch(element.parentNode, options);
    element.addEventListener('focus', function focusListener() {
      focusEventFired = true;
      element.removeEventListener('focus', focusListener);
    });
    element.focus();
    if(!focusEventFired) {
      options.type = 'focus';
      dispatched = this.dispatch(element, options);
    }
    return dispatched;
  };

  /**
  * Perform a real mouse move to the given coordinates.
  *
  * @param  int      x         The x position to go
  * @param  int      y         The y position to go
  * @param  Object   options   Clic options
  * @return Boolean
  */
  this.move = function move(x, y, options) {
    var curElement = document.elementFromPoint(_x, _y),
      targetElement = document.elementFromPoint(x, y);
    this.scroll(x, y, options);
    if(!targetElement) {
      throw Error('Couldn\'t perform the move. Coordinnates seems invalid.')
    }
    if(curElement===targetElement) {
      return false;
    }
    // Could move the cursor of %n px and repeat mouseover/out events
    // killer feature or overkill ?
    options = options || {};
    options.type = 'mouseout';
    options.relatedTarget = targetElement;
    dispatched = this.dispatch(curElement, options);
    options.type = 'mouseover';
    options.relatedTarget = curElement;
    dispatched = this.dispatch(targetElement, options);
    _x = x; _y = y;
    return true;
  };

  /**
  * Perform a real mouse move to an element.
  *
  * @param  DOMElement  element   A DOMElement on wich to move the cursor
  * @param  Object      options   Clic options
  * @return Boolean
  */
  this.moveTo = function moveTo(element, options) {
    var c = utils.getElementCenter(element);
    return this.move(c.x, c.y, options);
  };

  /**
  * Perform a scroll with the mouse wheel.
  *
  * @param  int         x         The x delta to scroll to
  * @param  int         y         The y delta to scroll to
  * @param  Object      options   Clic options
  * @return Boolean
  */
  this.scroll = function scroll(x, y, options) {
    var dispatched=true, scrollX = 0, scrollY = 0;
    options = options || {};
    options.type = ('onwheel' in document ? 'wheel' :
      ('onmousewheel' in document ? 'mousewheel' : '')
    );
    if(options.type) {
      // Moving through the x axis
      options.shiftKey = true;
      options.wheelDelta = 120;
      options.wheelDeltaX = (x < 0 ? 120 : -120);
      options.wheelDeltaY = 0;
      while(dispatched && (x+scrollX<0  || x+scrollX > window.innerWidth)) {
        dispatched=this.dispatch(document.elementFromPoint(_x, _y), options);
        if(dispatched) {
          scrollX +=  options.wheelDeltaX;
          window.scrollTo(window.scrollX - options.wheelDeltaX, window.scrollY);
        }
      }
      // Then moving through the y axis
      options.wheelDelta = 120;
      options.wheelDeltaX = 0;
      options.wheelDeltaY = (y < 0 ? 120 : -120);
      while(dispatched && (y+scrollY<0  || y+scrollY > window.innerHeight)) {
        dispatched=this.dispatch(document.elementFromPoint(_x, _y), options);
        if(dispatched) {
          scrollY +=  options.wheelDeltaY;
          window.scrollTo(window.scrollX, window.scrollY - options.wheelDeltaY);
        }
      }
    }
    return dispatched;
  };

  /**
  * Perform a scroll with the mouse wheel.
  *
  * @param  DOMElement  element   A DOMElement on wich to scroll to
  * @param  Object      options   Clic options
  * @return Boolean
  */
  this.scrollTo = function scrollTo(element, options) {
    // Getting element center
    var c = utils.getElementCenter(element);
    // Scroll only if the element is not already in the viewport
    if(c.x<0 || c.y<0 || c.x > window.innerWidth || c.y > window.innerHeight) {
      return this.scroll(c.x, c.y, options);
    }
    return false;
  };

  /**
  * Dispatches a mouse event to the given DOM element.
  *
  * @param  DOMElement  element   A DOMElement on wich to dispatch the event
  * @param  Object      options   Event options
  * @return Boolean
  */
  this.dispatch = function dispatch(element, options) {
    var event, button, coords;
    options = options || {};
    options.type = options.type || 'click';
    if(options.buttons !== options.buttons&this.BUTTONS_MASK) {
      throw Error('Bad value for the "buttons" property.');
    }
    options.buttons = options.buttons || this.LEFT_BUTTON;
    if(options.button) {
      throw Error('Please use the "buttons" property.');
    }
    button=( options.buttons&this.RIGHT_BUTTON ? 2 :
      ( options.buttons&this.MIDDLE_BUTTON? 1 : 0 )
    );
    coords = utils.getPossiblePointerCoords(element);
    if(null===coords) {
      throw Error('Unable to find a point in the viewport at wich the given'
        +' element can receive a mouse event.');
    }
    options.canBubble = ('false' === options.canBubble ? false : true);
    options.cancelable = ('false' === options.cancelable ? false : true);
    options.view = options.view || window;
    options.detail = options.detail || 1,
    options.altKey = !!options.altKey;
    options.ctrlKey = !!options.ctrlKey;
    options.shiftKey = !!options.shiftKey;
    options.metaKey = !!options.metaKey;
    options.relatedTarget = options.relatedTarget||null;
    if(document.createEvent) {
      try {
        event = new MouseEvent(options.type, {
          'view': options.view,
          'bubbles': options.canBubble,
          'cancelable': options.cancelable
        });
        utils.setEventProperty(event, 'altKey', options.altKey);
        utils.setEventProperty(event, 'ctrlKey', options.ctrlKey);
        utils.setEventProperty(event, 'shiftKey', options.shiftKey);
        utils.setEventProperty(event, 'metaKey', options.metaKey);
        utils.setEventProperty(event, 'buttons', options.buttons);
        utils.setEventProperty(event, 'button', button);
        utils.setEventProperty(event, 'relatedTarget', options.relatedTarget);
        utils.setEventCoords(event, coords.x, coords.y);
      } catch(e) {
        event = document.createEvent('MouseEvent');
        event.initMouseEvent(options.type,
          options.canBubble, options.cancelable,
          options.view, options.detail,
          // Screen coordinates (relative to the whole user screen)
          // FIXME: find a way to get the right screen coordinates
          coords.x + window.screenLeft, coords.y  + window.screenTop,
          // Client coordinates (relative to the viewport)
          coords.x, coords.y,
          options.ctrlKey, options.altKey,
          options.shiftKey, options.metaKey,
          button, options.relatedTarget);
        utils.setEventCoords(event, coords.x, coords.y);
        utils.setEventProperty(event, 'buttons', options.buttons);
      }
      return element.dispatchEvent(event);
    } else if(document.createEventObject) {
      event = document.createEventObject();
      event.eventType = options.type;
      event.button = button;
      event.buttons = option.buttons;
      return element.fireEvent('on'+options.type, event);
    }
  };

};

module.exports = new Mouse();

},{"../utils.js":8}],3:[function(require,module,exports){
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

},{"../utils.js":8,"./mouse.js":2}],4:[function(require,module,exports){
function Tactile() {

  // Neeed mouse to perform click
  var mouse = require('./mouse.js');
  var utils = require('../utils.js');

  /**
  * Indicates if tactile zone is available
  *
  * @return Boolean
  */
  this.isConnected = function () {
    return !!('ontouchstart' in window);
  };

  /**
  * Touch the screen and release immediatly on the given DOM element.
  *
  * @param  DOMElement  element   A DOMElement to touch
  * @param  Object      options   Touch options
  * @return Boolean
  */
  this.touch = function (element,options) {
    var dispatched;
    this.scrollTo(element);
    options = options || {};
    options.type = 'touchstart';
    dispatched = this.dispatch(element, options);
    options.type = 'touchend';
    if(this.dispatch(element, options)&&dispatched) {
      options.type = 'click';
      return mouse.dispatch(element, options);
    }
    return false;
  };

  /**
  * Perform a scroll with the fingers.
  *
  * @param  int         x         The x delta to scroll to
  * @param  int         y         The y delta to scroll to
  * @param  Object      options   Clic options
  * @return Boolean
  */
  this.scroll = function scroll(x, y, options) {
    var dispatched=true,
      scrollX = (x < 0 ? x :
        (x > window.innerWidth ? x - window.innerWidth : 0)
      ),
      scrollY = (y < 0 ? y :
        (y > window.innerHeight ? y - window.innerHeight : 0)
      ),
      moveX=Math.round(window.innerWidth/2),
      moveY=Math.round(window.innerHeight/2);
    options = options || {};
    // Put the finger on the middle of the screen
    options.type = 'touchstart';
    dispatched = this.dispatch(document.elementFromPoint(moveX, moveY),
      options);
    // Moving through the x/y axis
    while(dispatched && (scrollX != 0 || scrollY != 0)) {
      // repeat the move if the finger is about to go out of the screen
      if(moveX<10||moveY<10
        ||moveX>window.innerWidth-10
        ||moveY>window.innerHeight-10) {
        moveX = Math.round(window.innerWidth/2);
        moveY = Math.round(window.innerHeight/2);
      // Remove the finger of the screen
      options.type = 'touchend';
      dispatched = this.dispatch(document.elementFromPoint(moveX, moveY),
        options);
      // Re-put the finger on the middle of the screen
      options.type = 'touchstart';
      dispatched = this.dispatch(document.elementFromPoint(moveX, moveY),
        options);
      }
      // Move the finger
      options.type = 'touchmove';
      dispatched = dispatched &&
        this.dispatch(document.elementFromPoint(moveX, moveY), options);
      if(dispatched) {
        moveX +=  (scrollX < 0 ? 5 : -5);
        moveY +=  (scrollY < 0 ? 5 : -5);
        window.scrollTo(window.scrollX
            - (scrollX < 0 ? 120 : (scrollX > 0 ? -120 : 0)),
          window.scrollY
            - (scrollY < 0 ? 120 : (scrollY > 0 ? -120 : 0)));
        if(scrollX) {
          scrollX =  (scrollX < 0 ?
            (scrollX + 120 > 0 ? 0 : scrollX + 120) :
            (scrollX - 120 < 0 ? 0 : scrollX - 120));
        }
        if(scrollY) {
          scrollY =  (scrollY < 0 ?
            (scrollY + 120 > 0 ? 0 : scrollY + 120) :
            (scrollY - 120 < 0 ? 0 : scrollY - 120));
        }
      }
    }
    // Remove the finger of the screen
    options.type = 'touchend';
    dispatched = dispatched &&
      this.dispatch(document.elementFromPoint(moveX, moveY), options);
    return dispatched;
  };

  /**
  * Perform a scroll with the fingers to an element.
  *
  * @param  DOMElement  element   A DOMElement on wich to scroll to
  * @param  Object      options   Touch options
  * @return Boolean
  */
  this.scrollTo = function scrollTo(element, options) {
    // Getting element center
    var c = utils.getElementCenter(element);
    // Scroll only if the element is not already in the viewport
    if(c.x<0 || c.y<0 || c.x > window.innerWidth || c.y > window.innerHeight) {
      return this.scroll(c.x, c.y, options);
    }
    return false;
  };

  /**
  * Dispatches a touch event to the given DOM element.
  *
  * @param  DOMElement  element   A DOMElement on wich to dispatch the event
  * @param  Object      options   Event options
  * @return Boolean
  */
  this.dispatch = function (element,options) {
    var event = document.createEvent('UIEvent'), coords;
    options = options || {};
    options.canBubble = ('false' === options.canBubble ? false : true);
    options.cancelable = ('false' === options.cancelable ? false : true);
    options.view = options.view || window;
    options.detail = options.detail || 1,
    options.altKey = !!options.altKey;
    options.ctrlKey = !!options.ctrlKey;
    options.shiftKey = !!options.shiftKey;
    options.metaKey = !!options.metaKey;
    options.changedTouches = options.changedTouches || [];
    options.touches = options.touches | [];
    options.scale = options.scale || 1.0;
    options.rotation = options.rotation || 0.0;
    coords = utils.getPossiblePointerCoords(element);
    if(null===coords) {
      throw Error('Unable to find a point in the viewport at wich the given'
        +' element can receive a touch event.');
    }
    // Safari, Firefox: must use initTouchEvent.
    if ("function" === typeof event.initTouchEvent) {
        event.initTouchEvent(options.type,
          options.canBubble, options.cancelable,
          options.view, options.detail,
          // Screen coordinates (relative to the whole user screen)
          // FIXME: find a way to get the right screen coordinates
          coords.x + window.screenLeft, coords.y  + window.screenTop,
          // Client coordinates (relative to the viewport)
          coords.x, coords.y,
          options.ctrlKey, options.altKey,
          options.shiftKey, options.metaKey,
          options.touches, options.targetTouches, options.changedTouches,
          options.scale, options.rotation);
        utils.setEventCoords(event, coords.x, coords.y);
    } else {
        event.initUIEvent(options.type,
          options.canBubble, options.cancelable,
          options.view, options.detail);
        utils.setEventProperty(event, 'altKey', options.altKey);
        utils.setEventProperty(event, 'ctrlKey', options.ctrlKey);
        utils.setEventProperty(event, 'shiftKey', options.shiftKey);
        utils.setEventProperty(event, 'metaKey', options.metaKey);
        utils.setEventProperty(event, 'changedTouches', options.changedTouches);
        utils.setEventProperty(event, 'touches', options.touches);
        utils.setEventProperty(event, 'scale', options.scale);
        utils.setEventProperty(event, 'rotation', options.rotation);
        utils.setEventCoords(event, coords.x, coords.y);
    }
    return element.dispatchEvent(event);
  };

}

module.exports = new Tactile();

},{"../utils.js":8,"./mouse.js":2}],5:[function(require,module,exports){
function Element(selector) {
    
    var mouse = require('../devices/mouse.js');

    this.selector = selector;
    this.element = document.querySelector(selector);
    if (!this.element) {
        throw new Error("Element not found using selector '" + selector + "'");
    }

    this.isVisible = function isVisible() {
        try {
            var comp = window.getComputedStyle(this.element, null);
            return comp.visibility !== 'hidden' &&
                   comp.display !== 'none' &&
                   this.element.offsetHeight > 0 &&
                   this.element.offsetWidth > 0;
        } catch (e) {console.log(e);
            return false;
        }
    };

    this.click = function click() {
        return mouse.click(this.element);
    }

    this.dblclick = function dblclick() {
        return mouse.dblclick(this.element);
    }
}

module.exports = function element(selector) {
    return new Element(selector);
};
},{"../devices/mouse.js":2}],6:[function(require,module,exports){
function Input(elementOrSelector) {
    
    var mouse = require('../devices/mouse.js');

    if (typeof elementOrSelector == 'string') {
        this.element = document.querySelector(elementOrSelector);
        if (!this.element) {
            throw new Error("Element not found using selector '" + elementOrSelector + "'");
        }
    } else {
        if (!(elementOrSelector instanceof HTMLElement)) {
            throw new Error("Invalid input() arg: only selector or HTMLElement are supported");
        }
        this.element = elementOrSelector;
    }

    this.val = function val() {
        return this.element.value;
    };

    this.set = function set(value) {
        try {
            this.element.focus();
        } catch (e) {
            throw new Error("Unable to focus() input field " + this.element.getAttribute('name') + ": " + e);
        }

        this.element.value = value;
    };

    this.fill = function fill(value, method) {
        method = method || 'paste';
        switch(method) {
            case 'paste':
                mouse.paste(this.element, value);
                break;
        }
    };
}

module.exports = function input(elementOrSelector) {
    return new Input(elementOrSelector);
};
},{"../devices/mouse.js":2}],7:[function(require,module,exports){
module.exports.mouse = require('./devices/mouse.js');
module.exports.keyboard = require('./devices/keyboard.js');
module.exports.tactile = require('./devices/tactile.js');
module.exports.pointers = require('./devices/pointers.js');

module.exports.element = require('./dsl/element.js');
module.exports.input = require('./dsl/input.js');

},{"./devices/keyboard.js":1,"./devices/mouse.js":2,"./devices/pointers.js":3,"./devices/tactile.js":4,"./dsl/element.js":5,"./dsl/input.js":6}],8:[function(require,module,exports){
module.exports={

  setEventCoords: function(event, x, y) {
    this.setEventProperty(event, 'clientX', x);
    this.setEventProperty(event, 'clientY', y);
    this.setEventProperty(event, 'pageX', x + window.scrollX);
    this.setEventProperty(event, 'pageY', y + window.scrollY);
  },

  // Find the center of an element
  getElementCenter: function(element) {
    var c={};
    try {
      var rect = element.getBoundingClientRect();
      c.x = Math.floor((rect.left + rect.right) / 2);
      c.y = Math.floor((rect.top + rect.bottom) / 2);
    } catch(e) {
      c.x = 1;
      c.y = 1;
    }
    return c;
  },

  // Find a point in the viewport at wich an element can be the root of
  // a pointer event (is not under another element)
  getPossiblePointerCoords: function(element) {
    var comp, rects, coords = null;
    comp = window.getComputedStyle(element, null);
    rects=element.getClientRects();
    if('none' !== comp.pointerEvents && rects.length) {
      mainLoop: for(var i=rects.length-1; i>=0; i--) {
        for(var x=rects[i].left, mX=rects[i].right; x<mX; x++) {
          for(var y=rects[i].top, mY=rects[i].bottom; y<mY; y++) {
            if(element === document.elementFromPoint(x,y)) {
              coords = {x: x, y: y};
              break mainLoop;
            }
          }
        }
      }
    }
    return coords;
  },

  // Set event property with a Chromium specific hack
  setEventProperty: function(event, property, value) {
    try {
      Object.defineProperty(event, property, {
        get : function() {
          return value;
        }
      });
    } catch(e) {
      event[property] = value;
    }
  },

  // Tell if the element can accept the given content
  canAcceptContent: function(element, content) {
    var nodeName = element.nodeName.toLowerCase(),
        type = element.hasAttribute('type') ? element.getAttribute('type') : null;

    if (nodeName === 'textarea') {
      return true;
    }
    if (nodeName === 'input' 
      && ['text', 'password', 'number', 'date'].indexOf(type) !== -1) {
      return true;
    }
		return false;
  },

  // Tell if the element content can be partially selected
  isSelectable: function(element) {
    if('TEXTAREA'===element.nodeName
			||('INPUT'===element.nodeName&&element.hasAttribute('type')
				&&('text'===element.getAttribute('type')
			    ||'number'===element.getAttribute('type'))
			)
		) {
		  return true;
		}
		return false;
  },

  // dispatch a simple event
  dispatch: function(element, options) {
    var event;
    options = options || {};
    options.canBubble = ('false' === options.canBubble ? false : true);
    options.cancelable = ('false' === options.cancelable ? false : true);
    options.view = options.view || window;
    try {
      event = document.createEvent("Event");
      event.initEvent(options.type,
        options.canBubble, options.cancelable);
      return element.dispatchEvent(event);
    } catch(e) {
      return !element.dispatchEvent(event);
      // old IE fallback
      event = document.createEventObject();
      return element.fireEvent('on'+options.type, event)
    }
  }

};

},{}]},{},[7])
(7)
});
;