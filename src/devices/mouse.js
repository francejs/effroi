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
  var _x=1, _y=1;

  /**
  * Perform a real mouse bouble click on the given DOM element.
  *
  * @param  DOMElement  element   A DOMElement to dblclick
  * @param  Object      options   Clic options
  * @return Boolean
  */
  this.dblclick = function click(element, options) {
		var dispatched;
		options=options||{};
		dispatched=this.click(element, options);
		if(!(this.click(element, options)&&dispatched)) {
			return false;
		}
		options.type='dblclick';
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
  * Perform a real mouse move to the given coordinates.
  *
  * @param  int      x         The x position to go
  * @param  int      y         The y position to go
  * @param  Object   options   Clic options
  * @return Boolean
  */
  this.moveTo = function moveTo(x, y, options) {
    var curElement=document.elementFromPoint(_x, _y),
      targetElement=document.elementFromPoint(x, y);
    if(!targetElement) {
      throw Error('Couldn\'t perform the move. Coordinnates seems invalid.')
    }
    if(curElement===targetElement) {
      return false;
    }
    // Could move the cursor of %n px and repeat mouseover/out events
    // killer feature or overkill ?
		options=options||{};
		options.type='mouseout';
		options.relatedTarget=targetElement;
		dispatched=this.dispatch(curElement, options);
		options.type='mouseover';
		options.relatedTarget=curElement;
		dispatched=this.dispatch(targetElement, options);
		_x=x; _y=y;
		return true;
  };

  /**
  * Perform a real mouse move to an element.
  *
  * @param  DOMElement  element   A DOMElement on wich to move the cursor
  * @param  Object      options   Clic options
  * @return Boolean
  */
  this.move = function moveTo(element, options) {
    var c = utils.getElementCenter(element);
		return this.moveTo(c.x, c.y, options);
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
		options=options||{};
		options.type=options.type||'click';
		if(options.buttons!==options.buttons&this.BUTTONS_MASK) {
		  throw Error('Bad value for the "buttons" property.');
		}
		options.buttons=options.buttons||this.LEFT_BUTTON;
		if(options.button) {
		  throw Error('Please use the "buttons" property.');
		}
		button=( options.buttons&this.RIGHT_BUTTON ? 2 :
		  ( options.buttons&this.MIDDLE_BUTTON? 1 : 0 )
		);
		options.view=options.view||window;
		options.altKey = !!options.altKey;
		options.ctrlKey = !!options.ctrlKey;
		options.shiftKey = !!options.shiftKey;
		options.metaKey = !!options.metaKey;
		options.relatedTarget = options.relatedTarget||null;
		if(document.createEvent) {
			try {
				event = new MouseEvent(options.type, {
					'view': window,
					'bubbles': options.canBubble ? false : true,
					'cancelable': options.cancelable ? false : true
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
					'false' === options.canBubble ? false : true,
					'false' === options.cancelable ? false : true,
					options.view,
					options.detail||1,
					fakeEvent.screenX, fakeEvent.screenY,
					fakeEvent.clientX, fakeEvent.clientY,
					options.ctrlKey, options.altKey,
					options.shiftKey, options.metaKey,
					button,
					options.relatedTarget);
   			utils.setEventCoords(event, element);
  			utils.setEventProperty(event, 'buttons', options.buttons);
			}
			return element.dispatchEvent(event);
		} else if(document.createEventObject) {
			event = document.createEventObject();
			event.eventType=options.type;
			event.button=button;
			event.buttons=option.buttons;
      return element.fireEvent('on'+options.type, event);
		}
  };

};

module.exports = new Mouse();
