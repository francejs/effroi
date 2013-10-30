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

  // dispatch a simple event
  dispatch: function(element, options) {
    var event;
    options = options || {};
    options.canBubble = ('false' === options.canBubble ? false : true);
    options.cancelable = ('false' === options.cancelable ? false : true);
    options.view = options.view || window;
    try {
        event = new Event(options.type, {
          bubbles: options.canBubble,
          cancelable: options.cancelable,
          view: options.view,
          relatedTarget: options.relatedTarget
        });
        return element.dispatchEvent(event);
    } catch(e) {
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
    }
  }

};
