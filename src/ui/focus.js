function Focus() {

  var utils = require('../utils.js');

  // Private vars
  var _focusedInput, _focusedInputValue;

  // Consts
  this.EVENT_BLUR = 'blur';
  this.EVENT_FOCUS = 'focus';
  this.EVENT_FOCUSIN = 'focusin';
  this.EVENT_FOCUSOUT = 'focusout';
  this.EVENT_TYPES=[this.EVENT_BLUR, this.EVENT_FOCUS,this.EVENT_FOCUSIN,
    this.EVENT_FOCUSOUT];

  /**
  * Give the focus to the given DOM element.
  * http://www.w3.org/TR/DOM-Level-3-Events/#events-focusevent
  *
  * @param  DOMElement  element   A DOMElement to focus
  * @param  Object      options   Event options
  * @return Boolean
  */
  this.focus = function focus(element, options) {
    var activeElement = document.activeElement,
      focusEventFired = false,
      focusinEventFired = false;
    // Default options
    options = options || {};
    options.relatedTarget = options.relatedTarget || activeElement;
    // First blur the activeElement
    if(activeElement) {
      this.blur(options);
    }
    // Registering listeners to check that events are fired
    function focusListener(evt) {
      focusEventFired = true;
      element.removeEventListener(evt.type, focusListener);
    }
    element.addEventListener(this.EVENT_FOCUS, focusListener);
    function focusInListener(evt) {
      focusinEventFired = true;
      element.removeEventListener(evt.type, focusInListener);
    }
    element.addEventListener(this.EVENT_FOCUSIN, focusInListener);
    // Calling the focus method
    element.focus();
    // Saving value for inputs
    if(utils.isValuable(element)) {
      _focusedInputValue = (element.value || element.checked);
      _focusedInput = element;
    } else {
      _focusedInputValue = undefined;
      _focusedInput = null;
    }
    // Dispatch a focus event if not done before
    if(!focusEventFired) {
      element.removeEventListener(this.EVENT_FOCUS, focusListener);
      options.type = this.EVENT_FOCUS;
      options.canBubble = false;
      this.dispatch(element, options);
    }
    // then dispatch a focusin event
    if(!focusinEventFired) {
      element.removeEventListener(this.EVENT_FOCUSIN, focusInListener);
      options.type = this.EVENT_FOCUSIN;
      options.canBubble = true;
      this.dispatch(element, options);
    }
    return !!activeElement;
  };

  /**
  * Blur the currently focused DOM element.
  * http://www.w3.org/TR/DOM-Level-3-Events/#events-focusevent
  *
  * @param  Object      options   Event options
  * @return Boolean
  */
  this.blur = function blur(options) {
    var activeElement = document.activeElement,
      blurEventFired = false,
      focusoutEventFired = false;
    if(activeElement) {
      // Default options
      options = options || {};
      // Fire change event if some changes
      if(_focusedInput === activeElement && 'undefined' !== typeof _focusedInputValue
        && _focusedInputValue !== (activeElement.value || activeElement.checked)) {
        options.type = 'change';
        options.canBubble = true;
        options.cancelable = false;
        utils.dispatch(activeElement, options);
      }
      options.relatedTarget = options.relatedTarget || null;
      // Registering listeners to check that events are fired
      function blurListener(evt) {
        blurEventFired = true;
        activeElement.removeEventListener(evt.type, blurListener);
      }
      activeElement.addEventListener(this.EVENT_BLUR, blurListener);
      function focusoutListener(evt) {
        focusoutEventFired = true;
        activeElement.removeEventListener(evt.type, focusoutListener);
      }
      activeElement.addEventListener(this.EVENT_FOCUSOUT, focusoutListener);
      // Calling the blur method
      activeElement.blur();
      // Dispatch a blur event if not done before
      if(!blurEventFired) {
        activeElement.removeEventListener(this.EVENT_BLUR, blurListener);
        options.type = this.EVENT_BLUR;
        options.canBubble = false;
        this.dispatch(activeElement, options);
      }
      // Then a focusout event
      if(!focusoutEventFired) {
        activeElement.removeEventListener(this.EVENT_FOCUSOUT, focusoutListener);
        options.type = this.EVENT_FOCUSOUT;
        options.canBubble = true;
        this.dispatch(activeElement, options);
      }
      return true;
    }
    return false;
  };

  /**
  * Dispatches a FocusEvent instance to the given DOM element.
  * http://www.w3.org/TR/DOM-Level-3-Events/#events-focusevent
  *
  * @param  DOMElement  element   A DOMElement on wich to dispatch the event
  * @param  Object      options   Event options
  * @return Boolean
  */
  this.dispatch = function dispatch(element, options) {
    var event;
    // Setting default options
    if((!options.type) || -1 === this.EVENT_TYPES.indexOf(options.type)) {
      throw Error('Bad FocusEvent type provided "'+options.type+'".');
    }
    options.canBubble = ('false' === options.canBubble ? false : true);
    // Every FocusEvent instances aren't cancelable
    options.cancelable = options.cancelable || false;
    options.details = options.detail | 0;
    options.view = options.view || window;
    try {
      // First try to use the constructor
      try {
        event = new FocusEvent(options.type, {
          bubbles: options.canBubble,
          cancelable: options.cancelable,
          view: options.view,
          detail: options.detail,
          relatedTarget: options.relatedTarget
        });
      } catch(e) {
        // the standard interface is FocusEvent, but not always provided
        if('FocusEvent' in window) {
          event = document.createEvent("FocusEvent");
        } else {
          event = document.createEvent("Event");
        }
        // IE9+ provides a initFocusEvent method
        // http://msdn.microsoft.com/en-us/library/ie/ff974341(v=vs.85).aspx
        if('initFocusEvent' in event) {
          event.initFocusEvent(options.type,
            options.canBubble, options.cancelable,
            options.view, options.detail,
            options.relatedTarget);
        } else {
          event.initEvent(options.type, options.canBubble, options.cancelable);
          utils.setEventProperty(event, 'relatedTarget', options.relatedTarget);
        }
        
      }
      return element.dispatchEvent(event);
    } catch(e) {
      // old IE fallback
      event = document.createEventObject();
      event.eventType = options.type;
      event.relatedTarget = options.relatedTarget;
      return element.fireEvent('on'+type, event)
    }
  };

}

module.exports = new Focus();
