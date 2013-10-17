function Mouse() {

  var utils = require('../utils.js');

  this.click = function click(element, options) {
		var dispatched;
		options=options||{};
		options.type='mousedown';
		dispatched=this.dispatch(element, options);
		options.type='mouseup';
		if(!(this.dispatch(element, options)&&dispatched)) {
			return false;
		}
		options.type='click';
		return this.dispatch(element, options);
  };

  /**
  * Dispatches a mouse event to the DOM element behind the provided selector.
  *
  * @param  String  type      Type of event to dispatch
  * @param  DOMElement  elt  A DOMElement to click
  * @return Boolean
  */
  this.dispatch = function dispatch(element, options) {
		var event;
		options=options||{};
		options.type=options.type||'click';
		options.button=options.button||1;
		options.view=options.view||window;
		options.altKey = !!options.altKey;
		options.ctrlKey = !!options.ctrlKey;
		options.shiftKey = !!options.shiftKey;
		options.metaKey = !!options.metaKey;
		if(document.createEvent) {
			try {
				event = new MouseEvent(options.type, {
					'view': window,
					'bubbles': options.canBubble ? false : true,
					'cancelable': options.cancelable ? false : true
				});
				event.altKey = options.altKey;
				event.ctrlKey = options.ctrlKey;
				event.shiftKey = options.shiftKey;
				event.metaKey = options.metaKey;
			} catch(e) {
				event = document.createEvent('MouseEvent');
				event.initMouseEvent(options.type,
					'false' === options.canBubble ? false : true,
					'false' === options.cancelable ? false : true,
					options.view,
					options.detail||1,
					options.screenX||0, options.screenY||0,
					options.clientX||0, options.clientY||0,
					options.ctrlKey, options.altKey,
					options.shiftKey, options.metaKey,
					options.button,
					options.relatedTarget||element);
			}
			// Chromium Hack
			try {
				Object.defineProperty(event, 'which', {
					get : function() {
						return options.button;
					}
				});
			} catch(e) {
				event.wich=options.button;
			}
			return element.dispatchEvent(event);
		} else if(document.createEventObject) {
			event = document.createEventObject();
			event.eventType=options.type;
			event.button=options.button;
      return element.fireEvent('on'+options.type, event);
		}
  };

};

module.exports = new Mouse();
