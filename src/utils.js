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

  // Returns a list of focusable elements in the document
  getFocusableElements: function(element) {
    // FIXME: Ordinate elements with tabindexes + fallback for querySelector
    return document.querySelectorAll(
      'input:not(:disabled), textarea:not(:disabled), '
      + 'a[href]:not(:disabled):not(:empty), button:not(:disabled), '
      + 'select:not(:disabled)');
  },

  // focus an element an fire blur/focus events if not done automagically
  focus: function(element, options) {
    var dispatched, eventFired = false, activeElement = document.activeElement,
      that=this;
    options = options || {};
    // Focus events can't bubble
    options.canBubble = false;
    options.cancelable = false;
    if(activeElement) {
      options.type = 'blur'
      options.relatedTarget = element;
      activeElement.addEventListener(options.type, function blurListener(evt) {
        eventFired = true;
        activeElement.removeEventListener(options.type, blurListener);
      });
      activeElement.blur();
      if(!eventFired) {
        this.dispatchFocusEvent('blur', activeElement, element);
      }
      eventFired = false;
    }
    options.type = 'focus';
    element.addEventListener(options.type, function focusListener(evt) {
      eventFired = true;
      dispatched = !event.defaultPrevented;
      element.removeEventListener(options.type, focusListener, true);
    });
    element.focus();
    if(!eventFired) {
      dispatched = this.dispatchFocusEvent('focus', element, activeElement);
    }
    return dispatched;
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
      this.setEventProperty(event, 'relatedTarget', options.relatedTarget);
      return element.dispatchEvent(event);
    } catch(e) {
      // old IE fallback
      event = document.createEventObject();
      event.eventType = options.type;
      event.relatedTarget = options.relatedTarget;
      return element.fireEvent('on'+options.type, event)
    }
  },

  // dispatch a focus event http://www.w3.org/TR/DOM-Level-3-Events/#events-focusevent
  dispatchFocusEvent: function(type, target, relatedTarget) {
    var event, canBubble, cancelable;
    if('focusin' === type || 'focusout' === type) {
      canBubble = cancelable = true;
    } else if('blur' === type || 'focus' === type) {
      canBubble = cancelable = false;
    } else {
      throw Error('Unknow focus event type "' + type + '".');
    }
    try {
      // First try to use the constructor
      try {
        var event = new FocusEvent(type, canBubble, cancelable, window, 0,
            relatedTarget);
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
          event.initFocusEvent(type, canBubble, cancelable, window, 0,
            relatedTarget);
        } else {
          event.initEvent(type, canBubble, cancelable);
          this.setEventProperty(event, 'relatedTarget', relatedTarget);
        }
        
      }
      return target.dispatchEvent(event);
    } catch(e) {
      // old IE fallback
      event = document.createEventObject();
      event.eventType = type;
      event.relatedTarget = relatedTarget;
      return target.fireEvent('on'+type, event)
    }
  }

};
