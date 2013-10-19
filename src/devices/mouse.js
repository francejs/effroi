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
        console.log(scrollX, dispatched, _x, _y, window.scrollX);
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
