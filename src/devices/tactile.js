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
