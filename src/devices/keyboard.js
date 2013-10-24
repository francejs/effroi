function Keyboard() {

  var utils = require('../utils.js');
  var mouse = require('./mouse.js');

  // Configuration
  this.locale = ''; // ex: en-US

  // Consts
  this.UP = '38';
  this.DOWN = '40';
  this.LEFT = '37';
  this.RIGHT =  '39';
  this.ESC = '27';
  this.SPACE = '32';
  this.BACK_SPACE = '8';
  this.TAB = '9';
  this.DELETE = '46';
  this.ENTER = '13';
  
  
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
  var _downKeys = [], _keyDownDispatched = [];

  // Private functions
  // Stub for key mapping
  function _getPlatformKey(key) {
    return key;
  }
  // Return the char corresponding to the key if any
  function _getCharFromKey(key) {
    return String.fromCharCode(key);
  }
  // Try to add the char corresponding to the key to the activeElement
  function _inputKey(key) {
    var char = _getCharFromKey(key);
	  if(char&&utils.isSelectable(document.activeElement)) {
	    // add the char
	    // FIXME: put at caretPosition/replace selected content
		  document.activeElement.value += char;
		  // fire an input event
		  utils.dispatch(document.activeElement, {type: 'input'});
	  }
  }

  /**
  * Perform a key combination.
  *
  * @param  ArgumentList   arguments   Keycodes of the keys
  * @return Boolean
  */
	this.combine = function () {
		var dispatched;
		if(0 === arguments.length) {
		  throw Error('The combine method wait at least one key.');
		}
    // Pushing the keys sequentially
		dispatched = this.down.apply(this, arguments);
    // Releasing the keys sequentially
		return this.up.apply(this, arguments) && dispatched;
	};

  /**
  * Hit somes keys sequentially.
  *
  * @param  ArgumentList   arguments   Keycodes of the keys
  * @return Boolean
  */
	this.hit = function () {
		var dispatched = true;
		if(0 === arguments.length) {
		  throw Error('The hit method wait at least one key.');
		}
    // Hitting the keys sequentially
    for(var i=0, j=arguments.length; i<j; i++) {
      // Push the key
		  dispatched = this.down(arguments[i]) && dispatched;
      // Release the key
		  dispatched = this.up(arguments[i]) && dispatched;
		}
		return dispatched;
	};

  /**
  * Release somes keys of the keyboard.
  *
  * @param  ArgumentList   arguments   Keycodes of the keys
  * @return Boolean
  */

  this.up = function () {
    var dispatched = true, key, keyIndex;
		if(0 === arguments.length) {
		  throw Error('The up method wait at least one key.');
		}
    // Releasing the keys sequentially
    for(i=0, j=arguments.length; i<j; i++) {
      // get the platform specific key
      key = _getPlatformKey(arguments[i]);
      // check the key is down
      keyIndex = _downKeys.indexOf(key);
      if(-1 === keyIndex) {
        console.log(i, _downKeys, key)
        throw Error('Can\'t release a key that is not down ('+arguments[i]+')');
      }
      // dispatch the keyup event
  		dispatched = this.dispatch(document.activeElement, {
  		    type: 'keyup',
  		    keyCode: key
  		  }) && dispatched;
  		// unregister the key
  		_downKeys.splice(keyIndex, 1);
    }
    return dispatched;
  }

  /**
  * Push somes keys of the keyboard.
  *
  * @param  ArgumentList   arguments   Keycodes of the keys
  * @return Boolean
  */
  this.down = function () {
    var dispatched = true, key;
		if(0 === arguments.length) {
		  throw Error('The down method wait at least one key.');
		}
    // Pushing the keys sequentially
    for(i=0, j=arguments.length; i<j; i++) {
      dispatched = true;
      // get the platform specific key
      key = _getPlatformKey(arguments[i]);
      // check the key is down
      if(-1 !== _downKeys.indexOf(key)) {
        throw Error('Can\'t push a key already down ('+arguments[i]+')');
      }
      // dispatch the keydown event
  		dispatched = this.dispatch(document.activeElement, {
  		    type: 'keydown',
  		    keyCode: key
  		  }) && dispatched;
      // dispatch the keypress event if the keydown has been dispatched
      if(dispatched) {
        dispatched = this.dispatch(document.activeElement, {
  		    type: 'keypress',
  		    keyCode: key
  		  });
  		  // if keypress has been dispatched, try to input the char
  		  if(dispatched) {
    		  _inputKey(key);
  		  }
      }
      // register the newly down key
  		_downKeys.push(key);
    }
    return dispatched;
  }

  /**
  * Dispatches a keyboard event to the given DOM element.
  *
  * @param  DOMElement  element   A DOMElement on wich to dispatch the event
  * @param  Object      options   Event options
  * @return Boolean
  */
	this.dispatch = function (element, options) {
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
		options.repeat = !!options.repeat;
		options.location = options.location|0;
		options.modifier = options.modifier || '';
		char = String.fromCharCode(options.keyCode);
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
				  options.repeat, this.locale);
			} else {
			  event.initKeyEvent(options.type,
				'false' === options.canBubble ? false : true,
				'false' === options.cancelable ? false : true,
				options.view||window,
        options.ctrlKey, options.altKey, options.shiftKey, options.metaKey,
        options.keyCode, options.keyCode);
			}
      utils.setEventProperty(event, 'ctrlKey', options.ctrlKey);
      utils.setEventProperty(event, 'altKey', options.altKey);
      utils.setEventProperty(event, 'shiftKey', options.shiftKey);
      utils.setEventProperty(event, 'metaKey', options.metaKey);
      utils.setEventProperty(event, 'keyCode', options.keyCode);
      utils.setEventProperty(event, 'which', options.keyCode);
      utils.setEventProperty(event, 'charCode', options.keyCode);
      utils.setEventProperty(event, 'char', char);
			return element.dispatchEvent(event);
		} else if(document.createEventObject) {
			event = document.createEventObject();
			event.eventType = options.type;
      event.altKey = options.altKey;
      event.ctrlKey = options.ctrlKey;
      event.shiftKey = options.shiftKey;
      event.metaKey = options.metaKey;
			event.keyCode = options.keyCode;
			event.charCode = options.keyCode;
			event.char=char;
      return element.fireEvent('on'+options.type, event);
		}
	}

}

module.exports = new Keyboard();

