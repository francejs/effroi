function Keyboard() {

  var utils = require('../utils.js');
  var mouse = require('./mouse.js');

  // Consts
  this.ALT = 'Alt';
  this.ALT_GR = 'AltGraph';
  this.CAPS_LOCK = 'CapsLock';
  this.CTRL = 'Control';
  this.FN = 'Fn';
  this.META = 'Meta';
  this.NUM_LOCK = 'NumLock';
  this.SCROLL_LOCK = 'ScrollLock';  // Can be "Scroll" on IE9
  this.SHIFT = 'Shift';
  this.SYM_LOCK = 'SymbolLock';
  this.OS = 'OS'; // Can be "Win" on IE9

  // Private vars
  var _x = 1, _y = 1;

	this.hit = function (element,options) {
		var dispatched;
		options=options||{};
		options.type='keydown';
		dispatched=this.dispatch(element, options);
		if(dispatched&&options.keyCode
			&&String.fromCharCode(options.keyCode)
			&&('TEXTAREA'===element.nodeName
			||('INPUT'===element.nodeName&&element.hasAttribute('type')
				&&'text'===element.getAttribute('type')))) {
			element.value+=String.fromCharCode(options.keyCode);
		}
		options.type='keyup';
		if(!(this.dispatch(element, options)||dispatched)) {
			return false;
		}
		options.type='keypress';
		return this.dispatch(element, options);
	};

  // Keyboard interactions : lack of a keymap between various keyCode/charCode
	// in different browsers
	this.dispatch = function (element,options) {
		var event, char, modifiers;
		options=options || {};
    options.canBubble = ('false' === options.canBubble ? false : true);
    options.cancelable = ('false' === options.cancelable ? false : true);
    options.view = options.view || window;
		options.ctrlKey = !!options.ctrlKey;
		options.altKey = !!options.altKey;
		options.shiftKey = !!options.shiftKey;
		options.metaKey = !!options.metaKey;
		options.keyCode = options.keyCode|0;
		options.charCode = options.charCode|0;
		options.repeat = !!options.repeat;
		options.location = options.location|0;
		options.modifier = options.modifier || '';
		options.locale = options.locale || '';
		char = String.fromCharCode(options.charCode);
		if(document.createEvent) {
			event = document.createEvent('KeyboardEvent');
			if(typeof event.initKeyboardEvent !== 'undefined') {
			  if(options.shiftKey) {
			    modifiers += this.SHIFT;
			  }
			  if(options.crtlKey) {
			    modifiers += (modifiers ? ' ' : '') + this.CTRL;
			  }
			  if(options.altKey) {
			    modifiers += (modifiers ? ' ' : '') + this.ALT;
			  }
			  if(options.metaKey) {
			    modifiers += (modifiers ? ' ' : '') + this.META;
			  }
				event.initKeyboardEvent(options.type,
				  'false' === options.canBubble ? false : true,
				  'false' === options.cancelable ? false : true,
				  options.view||window, char, options.charCode,
				  options.location, modifiers,
				  options.repeat, options.locale);
			} else {
			  event.initKeyEvent(options.type,
				'false' === options.canBubble ? false : true,
				'false' === options.cancelable ? false : true,
				options.view||window,
        options.ctrlKey, options.altKey, options.shiftKey, options.metaKey,
        options.charCode, options.charCode);
			}
      utils.setEventProperty(event, 'ctrlKey', options.ctrlKey);
      utils.setEventProperty(event, 'altKey', options.altKey);
      utils.setEventProperty(event, 'shiftKey', options.shiftKey);
      utils.setEventProperty(event, 'metaKey', options.metaKey);
      utils.setEventProperty(event, 'keyCode', options.charCode);
      utils.setEventProperty(event, 'which', options.keyCode);
      utils.setEventProperty(event, 'charCode', options.charCode);
      utils.setEventProperty(event, 'char', char);
			return element.dispatchEvent(event);
		} else if(document.createEventObject) {
			event = document.createEventObject();
			event.eventType = options.type;
      event.altKey = options.altKey;
      event.ctrlKey = options.ctrlKey;
      event.shiftKey = options.shiftKey;
      event.metaKey = options.metaKey;
			event.keyCode = options.charCode;
			event.charCode = options.charCode;
			event.char=char;
      return element.fireEvent('on'+options.type, event);
		}
	}

}

module.exports = new Keyboard();

