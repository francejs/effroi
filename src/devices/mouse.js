function Mouse() {

  var utils = require('../utils.js');
  var uiFocus = require('../ui/focus.js');

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
    var dispatched;
    // We move to the element if not over yet
    this.moveTo(element);
    options = options || {};
    options.type = 'mousedown';
    dispatched=this.dispatch(element, options);
    // Here, maybe find the first parent element having greater bound rect
    // and move on it's focusable zone or fail if none available
    if(dispatched) {
      uiFocus.focus(element);
    }
    this.moveTo(element.parentNode);
    options.type = 'mouseup';
    this.dispatch(element.parentNode, options);
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
      targetElement,
      oldScrollX = window.scrollX,
      oldScrollY = window.scrollY,
      dispatched;
    // Could move the cursor of %n px and repeat mouseover/out events
    // killer feature or overkill ?
    options = options || {};
    options.type = 'mouseout';
    dispatched = this.dispatch(curElement, options);
    this.scroll(x, y, options);
    _x = x + oldScrollX - window.scrollX;
    _y = y + oldScrollY - window.scrollY;
    if(_x < 0 || _y < 0) {
      throw new Error('The mouse pointer coordinates can\'t be negative.');
    }
    if(_x >= window.innerWidth || _y >= window.innerHeight) {
      throw new Error('The mouse pointer coordinates can\'t be greater than the'
        +' viewport size.');
    }
    targetElement = document.elementFromPoint(_x, _y);
    if(!targetElement) {
      throw Error('Couldn\'t perform the move. Coordinnates seems invalid.');
    }
    if(curElement===targetElement) {
      return false;
    }
    options.type = 'mouseover';
    options.relatedTarget = curElement;
    dispatched = this.dispatch(targetElement, options);
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
    // We are giving the related target to avoid calculating it later
    options = options || {};
    options.relatedTarget = element;
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
    options.detail = options.detail || 1;
    options.altKey = !!options.altKey;
    options.ctrlKey = !!options.ctrlKey;
    options.shiftKey = !!options.shiftKey;
    options.metaKey = !!options.metaKey;
    options.relatedTarget = options.relatedTarget||null;
    // try to use the constructor (recommended with DOM level 3)
    // http://www.w3.org/TR/DOM-Level-3-Events/#new-event-interface-initializers
    try {
      event = new MouseEvent(options.type, {
        bubbles: options.canBubble,
        cancelable: options.cancelable,
        view: options.view,
        // FIXME: find a way to get the right screen coordinates
        screenX: coords.x + window.screenLeft,
        screenY: coords.y  + window.screenTop,
        clientX: coords.x,
        clientY: coords.y,
        altKey: options.altKey,
        ctrlKey: options.ctrlKey,
        shiftKey: options.shiftKey,
        metaKey: options.metaKey,
        button: button,
        buttons: options.buttons,
        relatedTarget: options.relatedTarget
      });
      // Chrome seems to not set the buttons property properly
      utils.setEventProperty(event, 'buttons', options.buttons);
      return element.dispatchEvent(event);
    } catch(e) {
      // old fashined event intializer
      if(document.createEvent) {
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
        return element.dispatchEvent(event);
      // old IE event initializer
      } else if(document.createEventObject) {
        event = document.createEventObject();
        event.eventType = options.type;
        event.button = button;
        event.buttons = option.buttons;
        return element.fireEvent('on'+options.type, event);
      }
    }
  };

}

module.exports = new Mouse();
