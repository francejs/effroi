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
  this.CTRL = 17;
  this.CAPS_LOCK = 20;
  // this.FN = ; Come back later with laptop
  // this.META = ; Dunno what is the corresponding key
  this.NUM_LOCK = 144;
  // this.SCROLL_LOCK = ; Dunno what is the corresponding key
  this.SHIFT = 16;
  // this.SYM_LOCK = ; Dunno what is the corresponding key
  // this.ALT_GR = ; Dunno what is the corresponding key
  this.OS = 91;
  
  
  this.MODIFIERS = {};
  this.MODIFIERS[this.ALT] = 'Alt';
  // this.MODIFIERS[this.ALT_GR] = 'AltGraph'; not supported
  this.MODIFIERS[this.CAPS_LOCK] = 'CapsLock';
  this.MODIFIERS[this.CTRL] = 'Control';
  // this.MODIFIERS[this.FN] = 'Fn'; not supported
  // this.MODIFIERS[this.META] = 'Meta'; not supported
  this.MODIFIERS[this.NUM_LOCK] = 'NumLock';
  // this.MODIFIERS[this.SCROLL_LOCK] = 'ScrollLock',  // Can be "Scroll" on IE9 not supported
  this.MODIFIERS[this.SHIFT] = 'Shift',
  // this.MODIFIERS[this.SYM_LOCK] = 'SymbolLock', not supported
  this.MODIFIERS[this.OS] = 'OS' // Can be "Win" on IE9

  // Private vars
  var _downKeys = [], _keyDownDispatched = [], _that=this;

  // Private functions

  // Stub for key mapping
  function _getPlatformKey(key) {
    return key;
  }

  // Return the char corresponding to the key if any
  function _getCharFromKey(key) {
    // C0 control characters
    if((key >=0 && key <= 0x1F) || 0x7F === key) {
      return '';
    }
    // C1 control characters
    if(key >= 0x80 && key <= 0x9F) {
      return '';
    }
    if(-1 !== _downKeys.indexOf(this.CTRL)) {
      return '';
    }
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

  // Compute current modifiers
  function _getModifiers() {
    var modifiers = '';
	  if(_downKeys.length) {
	    for(var i=_downKeys.length-1; i>=0; i--) {
	      if(_that.MODIFIERS[_downKeys[i]]) {
	        modifiers += (modifiers ? ' ' : '') + _that.MODIFIERS[_downKeys[i]];
	      }
	    }
	  }
	  return modifiers;
  }

  /**
  * Tab to the next element
  *
  * @param  DOMElement  element   A DOMElement to dblclick
  * @param  String      content   The content to paste
  * @return Boolean
  */
  this.tab = function tab() {
    // FIXME: Use tabindex + fallback for querySelector
    var elements = document.querySelectorAll(
      'input:not(:disabled), textarea:not(:disabled), '
      + 'a[href]:not(:disabled):not(:empty), button:not(:disabled), '
      + 'select:not(:disabled)'
    );
    // if nothing/nothing else to focus, fail
    if(1 >= elements.length) {
      return false;
    }
    // Looking for the activeElement index
    for(var i=elements.length-1; i>=0; i--) {
      if(elements[i] === document.activeElement) {
        break;
      }
    }
    // Hit the tab key
    this.hit(this.TAB);
    // Focus the next element
    return utils.focus(-1 === i || i+1 >= elements.length ?
      elements[0] : elements[i+1]);
  };

  /**
  * Cut selected content like if it were done by a user with Ctrl + X.
  *
  * @param  DOMElement  element   A DOMElement to dblclick
  * @param  String      content   The content to paste
  * @return Boolean
  */
  this.cut = function cut() {
    var content, element = document.activeElement;
    // if the keydown event is prevented we can't cut content
    if(!this.down(this.CTRL, 'x'.charCodeAt(0))) {
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
    // finally firing keyup events
    this.up(this.CTRL, 'x'.charCodeAt(0));
    return content;
  };

  /**
  * Paste content like if it were done by a user with Ctrl + V.
  *
  * @param  DOMElement  element   A DOMElement to dblclick
  * @param  String      content   The content to paste
  * @return Boolean
  */
  this.paste = function paste(content) {
    var element = document.activeElement;
    // The content of a paste is always a string
    if('string' !== typeof content) {
      throw Error('Can only paste strings (received '+(typeof content)+').');
    }
    if(!utils.canAcceptContent(element, content)) {
      throw Error('Unable to paste content in the given element.');
    }
    // if the keydown event is prevented we can't paste content
    if(!this.down(this.CTRL, 'v'.charCodeAt(0))) {
      this.up(this.CTRL, 'v'.charCodeAt(0));
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
    // finally firing the keyup events
    return this.up(this.CTRL, 'v'.charCodeAt(0));
  };

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
        throw Error('Can\'t release a key that is not down ('+arguments[i]+')');
      }
  		// unregister the key
  		_downKeys.splice(keyIndex, 1);
      // dispatch the keyup event
  		dispatched = this.dispatch(document.activeElement, {
  		    type: 'keyup',
  		    keyCode: key
  		  }) && dispatched;
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
      // register the newly down key
  		_downKeys.push(key);
      // dispatch the keydown event
  		dispatched = this.dispatch(document.activeElement, {
  		    type: 'keydown',
  		    keyCode: key
  		  }) && dispatched;
      // dispatch the keypress event if the keydown has been dispatched
      // and the CTRL key is not pressed
      if(dispatched&&-1 === _downKeys.indexOf(this.CTRL)) {
        dispatched = this.dispatch(document.activeElement, {
  		    type: 'keypress',
  		    keyCode: key
  		  });
  		  // if keypress has been dispatched, try to input the char
  		  if(dispatched) {
    		  _inputKey(key);
  		  }
      }
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
		var event, char, modifiers = _getModifiers(), location = 0;
		options=options || {};
    options.canBubble = ('false' === options.canBubble ? false : true);
    options.cancelable = ('false' === options.cancelable ? false : true);
    options.view = options.view || window;
		options.keyCode = options.keyCode|0;
		options.repeat = !!options.repeat;
		char = _getCharFromKey(options.keyCode);
		if(document.createEvent) {
			event = document.createEvent('KeyboardEvent');
			if(typeof event.initKeyboardEvent !== 'undefined') {
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
        -1 !== _downKeys.indexOf(this.CTRL), -1 !== _downKeys.indexOf(this.ALT),
        -1 !== _downKeys.indexOf(this.SHIFT), -1 !== _downKeys.indexOf(this.META),
        options.keyCode, options.keyCode);
			}
      utils.setEventProperty(event, 'ctrlKey',
        -1 !== _downKeys.indexOf(this.CTRL));
      utils.setEventProperty(event, 'altKey',
        -1 !== _downKeys.indexOf(this.ALT));
      utils.setEventProperty(event, 'shiftKey',
        -1 !== _downKeys.indexOf(this.SHIFT));
      utils.setEventProperty(event, 'metaKey',
        -1 !== _downKeys.indexOf(this.META));
      utils.setEventProperty(event, 'keyCode', options.keyCode);
      utils.setEventProperty(event, 'which', options.keyCode);
      utils.setEventProperty(event, 'charCode', options.keyCode);
      utils.setEventProperty(event, 'char', char);
			return element.dispatchEvent(event);
		} else if(document.createEventObject) {
			event = document.createEventObject();
			event.eventType = options.type;
      event.altKey = -1 !== _downKeys.indexOf(this.ALT);
      event.ctrlKey = -1 !== _downKeys.indexOf(this.CTRL);
      event.shiftKey = -1 !== _downKeys.indexOf(this.SHIFT);
      event.metaKey = -1 !== _downKeys.indexOf(this.META);
			event.keyCode = options.keyCode;
			event.charCode = options.keyCode;
			event.char=char;
      return element.fireEvent('on'+options.type, event);
		}
	}

}

module.exports = new Keyboard();

