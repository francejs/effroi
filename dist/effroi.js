!function(e){"object"==typeof exports?module.exports=e():"function"==typeof define&&define.amd?define(e):"undefined"!=typeof window?window.effroi=e():"undefined"!=typeof global?global.effroi=e():"undefined"!=typeof self&&(self.effroi=e())}(function(){var define,module,exports;
return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
  * Perform a real mouse double click on the given DOM element.
  *
  * @param  DOMElement  element   A DOMElement to dblclick
  * @param  Object      options   Clic options
  * @return Boolean
  */
  this.dblclick = function click(element, options) {
    var dispatched;
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
  * Perform a real mouse click on the given DOM element.
  *
  * @param  DOMElement  element   A DOMElement to click
  * @param  Object      options   Clic options
  * @return Boolean
  */
  this.click = function click(element, options) {
    var dispatched;
    this.moveTo(element);
    options = options||{};
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
    this.moveTo(element);
    options = options||{};
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
    var event, button;
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
        utils.setEventCoords(event, element);
      } catch(e) {
        event = document.createEvent('MouseEvent');
        var fakeEvent = {};
        utils.setEventCoords(fakeEvent, element);
        event.initMouseEvent(options.type,
          options.canBubble, options.cancelable,
          options.view, options.detail,
          fakeEvent.screenX, fakeEvent.screenY,
          fakeEvent.clientX, fakeEvent.clientY,
          options.ctrlKey, options.altKey,
          options.shiftKey, options.metaKey,
          button, options.relatedTarget);
        utils.setEventCoords(event, element);
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

},{"../utils.js":6}],2:[function(require,module,exports){
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
    var button, pointerType;
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
    var event = document.createEvent((_prefixed ? 'MS' : '') + 'PointerEvent');
    utils.setEventCoords(event, element);
    event.initPointerEvent(
      _prefixed ? 'MSPointer' + options.type[7].toUpperCase()
        + options.type.substring(8) : options.type,
      'false' === options.canBubble ? false : true,
      'false' === options.cancelable ? false : true,
      options.view||window, options.detail||1,
      options.screenX||0, options.screenY||0,
      options.clientX||0, options.clientY||0,
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

},{"../utils.js":6,"./mouse.js":1}],3:[function(require,module,exports){
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
    var event = document.createEvent('UIEvent'), fakeEvent={};
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
    // Safari, Firefox: must use initTouchEvent.
    if ("function" === typeof event.initTouchEvent) {
        utils.setEventCoords(fakeEvent, element);
        event.initTouchEvent(options.type,
          options.canBubble, options.cancelable,
          options.view, options.detail,
          fakeEvent.screenX, fakeEvent.screenY,
          fakeEvent.clientX, fakeEvent.clientY,
          options.ctrlKey, options.altKey,
          options.shiftKey, options.metaKey,
          options.touches, options.targetTouches, options.changedTouches,
          options.scale, options.rotation);
        utils.setEventCoords(event, element);
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
        utils.setEventCoords(event, element);
    }
    return element.dispatchEvent(event);
  };

}

module.exports = new Tactile();

},{"../utils.js":6,"./mouse.js":1}],4:[function(require,module,exports){
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
},{"../devices/mouse.js":1}],5:[function(require,module,exports){
module.exports.mouse = require('./devices/mouse.js');
module.exports.tactile = require('./devices/tactile.js');
module.exports.pointers = require('./devices/pointers.js');

module.exports.element = require('./dsl/element.js');

},{"./devices/mouse.js":1,"./devices/pointers.js":2,"./devices/tactile.js":3,"./dsl/element.js":4}],6:[function(require,module,exports){
module.exports={

	setEventCoords: function(event, element) {
	  var c = this.getElementCenter(element);
    this.setEventProperty(event, 'clientX', c.x);
    this.setEventProperty(event, 'clientY', c.y);
    this.setEventProperty(event, 'pageX', c.x+window.scrollX);
    this.setEventProperty(event, 'pageY', c.y+window.scrollY);
	},

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

	setEventProperty: function(event, property, value) {
		try {
				Object.defineProperty(event, property, {
					get : function() {
						return value;
					}
				});
			} catch(e) {
				event[property]=value;
			}
	}

};

},{}]},{},[5])
(5)
});
;