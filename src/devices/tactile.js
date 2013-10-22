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
