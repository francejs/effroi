function Keyboard() {

  var utils = require('../utils.js');
  var mouse = require('./mouse.js');

  // Configuration
  this.locale = ''; // ex: en-US

  // Consts
  // Maps for key / char properties
  // http://www.w3.org/TR/DOM-Level-3-Events/#key-values-list
  this.KEY_TO_CHAR = {
    'Cancel': '\u0018',
    'Esc': '\u001B',
    'Spacebar': '\u0020',
    'Add': '\u002B',
    'Subtract': '\u2212',
    'Multiply': '\u002A', // alternative '\u00D7'
    'Divide': '\u00F7',
    'Equals': '\u003D',
    'Decimal': '\u2396', // alternatives '\u002E' or '\u00B7'
    'Tab': '\u0009',
    'Backspace': '\u0008',
    'Del': '\u007F',
    'DeadGrave': '\u0300',
    'DeadAcute': '\u0301',
    'DeadCircumflex': '\u0302',
    'DeadTilde': '\u0303',
    'DeadMacron': '\u0304',
    'DeadBreve': '\u0306',
    'DeadAboveDot': '\u0307',
    'DeadUmlaut': '\u0308',
    'DeadAboveRing': '\u030A',
    'DeadDoubleAcute': '\u030B',
    'DeadCaron': '\u030C',
    'DeadCedilla': '\u0327',
    'DeadOgonek': '\u0328',
    'DeadIota': '\u0345',
    'DeadVoicedSound': '\u3099',
    'DeadSemivoicedSound': '\u309A'
  };
  this.CHAR_TO_KEY = {
    '\u0018': 'Cancel',
    '\u001B': 'Esc',
    '\u0020': 'Spacebar',
    '\u002B': 'Add',
    '\u2212': 'Subtract',
    '\u002A': 'Multiply',
    '\u00D7': 'Multiply',
    '\u00F7': 'Divide',
    '\u003D': 'Equals',
    '\u2396': 'Decimal',
    '\u002E': 'Decimal',
    '\u00B7': 'Decimal',
    '\u0009': 'Tab',
    '\u0008': 'Backspace',
    '\u007F': 'Del',
    '\u0300': 'DeadGrave',
    '\u0301': 'DeadAcute',
    '\u0302': 'DeadCircumflex',
    '\u0303': 'DeadTilde',
    '\u0304': 'DeadMacron',
    '\u0306': 'DeadBreve',
    '\u0307': 'DeadAboveDot',
    '\u0308': 'DeadUmlaut',
    '\u030A': 'DeadAboveRing',
    '\u030B': 'DeadDoubleAcute',
    '\u030C': 'DeadCaron',
    '\u0327': 'DeadCedilla',
    '\u0328': 'DeadOgonek',
    '\u0345': 'DeadIota',
    '\u3099': 'DeadVoicedSound',
    '\u309A': 'DeadSemivoicedSound'
  };
  this.KEYS = [
    'Attn', 'Apps', 'Crsel', 'Exsel', 'F1', 'F2', 'F3', 'F4',
    'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12', 'F13',
    'F14', 'F15', 'F16', 'F17', 'F18', 'F19', 'F20', 'F21',
    'F22', 'F23', 'F24', 'LaunchApplication1', 'LaunchApplication2',
    'LaunchMail', 'List', 'Props', 'Soft1', 'Soft2', 'Soft3', 'Soft4',
    'Accept', 'Again', 'Enter', 'Find', 'Help', 'Info', 'Menu', 'Pause',
    'Play', 'Scroll', 'Execute', 'Cancel', 'Esc', 'Exit', 'Zoom', 'Separator',
    'Spacebar', 'Add', 'NumLock', 'Subtract', 'NumLock', 'Multiply',
    'Divide', 'Equals', 'Decimal', 'BrightnessDown', 'BrightnessUp', 'Camera',
    'Eject', 'Power', 'PrintScreen', 'BrowserFavorites', 'BrowserHome',
    'BrowserRefresh', 'BrowserSearch', 'BrowserStop', 'BrowserBack',
    'BrowserForward', 'Left', 'PageDown', 'PageUp', 'Right', 'Up', 'UpLeft',
    'UpRight', 'Down', 'DownLeft', 'DownRight', 'Home', 'End', 'Select', 'Tab',
    'Backspace', 'Clear', 'Copy', 'Cut', 'Del', 'EraseEof', 'Insert', 'Paste',
    'Undo', 'DeadGrave', 'DeadAcute', 'DeadCircumflex', 'DeadTilde',
    'DeadMacron', 'DeadBreve', 'DeadAboveDot', 'DeadUmlaut', 'DeadAboveRing',
    'DeadDoubleAcute', 'DeadCaron', 'DeadCedilla', 'DeadOgonek', 'DeadIota',
    'DeadVoicedSound', 'DeadSemivoicedSound', 'Alphanumeric', 'Alt', 'AltGraph',
    'CapsLock', 'Control', 'Fn', 'FnLock', 'Meta', 'Process', 'NumLock', 'Shift',
    'SymbolLock', 'OS', 'Compose', 'AllCandidates', 'NextCandidate',
    'PreviousCandidate', 'CodeInput', 'Convert', 'Nonconvert', 'FinalMode',
    'FullWidth', 'HalfWidth', 'ModeChange', 'RomanCharacters', 'HangulMode',
    'HanjaMode', 'JunjaMode', 'Hiragana', 'KanaMode', 'KanjiMode', 'Katakana',
    'AudioFaderFront', 'AudioFaderRear', 'AudioBalanceLeft',
    'AudioBalanceRight', 'AudioBassBoostDown', 'AudioBassBoostUp', 'VolumeMute',
    'VolumeDown', 'VolumeUp', 'MediaPause', 'MediaPlay', 'MediaTrackEnd',
    'MediaNextTrack', 'MediaPlayPause', 'MediaPreviousTrack', 'MediaTrackSkip',
    'MediaTrackStart', 'MediaStop', 'SelectMedia', 'Blue', 'Brown',
    'ChannelDown', 'ChannelUp', 'ClearFavorite0', 'ClearFavorite1',
    'ClearFavorite2', 'ClearFavorite3', 'Dimmer', 'DisplaySwap', 'FastFwd',
    'Green', 'Grey', 'Guide', 'InstantReplay', 'MediaLast', 'Link', 'Live',
    'Lock', 'NextDay', 'NextFavoriteChannel', 'OnDemand', 'PinPDown',
    'PinPMove', 'PinPToggle', 'PinPUp', 'PlaySpeedDown', 'PlaySpeedReset',
    'PlaySpeedUp', 'PrevDay', 'RandomToggle', 'RecallFavorite0',
    'RecallFavorite1', 'RecallFavorite2', 'RecallFavorite3', 'MediaRecord',
    'RecordSpeedNext', 'Red', 'MediaRewind', 'RfBypass', 'ScanChannelsToggle',
    'ScreenModeNext', 'Settings', 'SplitScreenToggle', 'StoreFavorite0',
    'StoreFavorite1', 'StoreFavorite2', 'StoreFavorite3', 'Subtitle', 
    'AudioSurroundModeNext', 'Teletext', 'VideoModeNext', 'DisplayWide', 'Wink',
    'Yellow', 'Unidentified'
  ];
  // Frequently used keys
  this.UP = 'Up';
  this.DOWN = 'Down';
  this.LEFT = 'Left';
  this.RIGHT =  'Right';
  this.ESC = 'Esc';
  this.SPACE = 'Spacebar';
  this.BACK_SPACE = 'Backspace';
  this.TAB = 'Tab';
  this.DELETE = 'Del';
  this.ENTER = 'Enter';
  this.CTRL = 'Control';
  this.CAPS_LOCK = 'CapsLock';
  this.FN = 'Fn';
  this.FN_LOCK = 'FnLock';
  this.META = 'Meta';
  this.NUM_LOCK = 'NumLock';
  this.SCROLL_LOCK = 'ScrollLock';
  this.SHIFT = 'Shift';
  this.SYM_LOCK = 'SymbolLock';
  this.ALT_GR = 'AltGraph';
  this.OS = 'OS';
  // Legacy map: http://www.w3.org/TR/DOM-Level-3-Events/#fixed-virtual-key-codes
  this.KEY_TO_CHARCODE = {
    'Up': '38',
    'Down': '40',
    'Left': '37',
    'Right': '39',
    'Esc': '27',
    'Spacebar': '32',
    'Backspace': '8',
    'Tab': '9',
    'Del': '46',
    'Enter': '13',
    'Control': 17,
    'Caps': 20,
    'NumLock': 144,
    'Shift': 16,
    'OS': 91,
    'Alt': 18,
    'CapsLock': 20,
    'PageUp': 33,
    'PageDown': 34,
    'End': 35,
    'Home': 36
  };
  // Modifiers (legacy) http://www.w3.org/TR/DOM-Level-3-Events/#keys-Modifiers
  this.MODIFIERS = [this.ALT, this.ALT_GR, this.CAPS_LOCK, this.CTRL, this.FN,
    this.META, this.NUM_LOCK, this.SCROLL_LOCK, this.SHIFT, this.SYM_LOCK,
    this.OS
  ];

  // Private vars
  var _downKeys = [], _keyDownDispatched = [], _that=this;

  // Private functions

  // Return the char corresponding to the key if any
  function _charIsPrintable(charCode) {
    // C0 control characters
    if((charCode >=0 && charCode <= 0x1F) || 0x7F === charCode) {
      return false;
    }
    // C1 control characters
    if(charCode >= 0x80 && charCode <= 0x9F) {
      return false;
    }
    if(-1 !== _downKeys.indexOf(this.CTRL)) {
      return false;
    }
    return true;
  }

  // Try to add the char corresponding to the key to the activeElement
  function _inputChar(char) {
    if(_charIsPrintable(char.charCodeAt(0))
      &&utils.isSelectable(document.activeElement)) {
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
        if(-1 !== _that.MODIFIERS.indexOf(_downKeys[i])) {
          modifiers += (modifiers ? ' ' : '') + _downKeys[i];
        }
      }
    }
    return modifiers;
  }

  /**
  * Focus an element by using tab
  *
  * @param  DOMElement  element   A DOMElement to tab to
  * @return Boolean
  */
  this.focus = function focus(element) {
    var activeElement = document.activeElement;
    // If the element is already focused return false
    if(activeElement === element) {
      return false;
    }
    // Performing a first tab
    this.tab();
    activeElement = document.activeElement;
    while(activeElement != element && this.tab()
      && activeElement != document.activeElement) {
      continue;
    }
    if(activeElement !== element) {
      return false;
    }
    return true;
  };

  /**
  * Tab to the next element
  *
  * @return Boolean
  */
  this.tab = function tab() {
    var elements = utils.getFocusableElements(), dispatched;
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
    // Push the tab key down
    this.down(this.TAB);
    // Focus the next element
    dispatched = utils.focus(-1 === i || i+1 >= elements.length ?
      elements[0] : elements[i+1]);
    // Release the tab key
    this.up(this.TAB);
    return dispatched;
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
    if(!this.down(this.CTRL, 'x')) {
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
    this.up(this.CTRL, 'x');
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
    if(!this.down(this.CTRL, 'v')) {
      this.up(this.CTRL, 'v');
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
    return this.up(this.CTRL, 'v');
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
    var dispatched = true, keyIndex;
    if(0 === arguments.length) {
      throw Error('The up method wait at least one key.');
    }
    // Releasing the keys sequentially
    for(i=0, j=arguments.length; i<j; i++) {
      // get the platform specific key
      // check the key is down
      keyIndex = _downKeys.indexOf(arguments[i]);
      if(-1 === keyIndex) {
        throw Error('Can\'t release a key that is not down ('+arguments[i]+')');
      }
      // unregister the key
      _downKeys.splice(keyIndex, 1);
      // dispatch the keyup event
      dispatched = this.dispatch(document.activeElement, {
          type: 'keyup',
          key: arguments[i]
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
    var dispatched = true;
    if(0 === arguments.length) {
      throw Error('The down method wait at least one key.');
    }
    // Pushing the keys sequentially
    for(i=0, j=arguments.length; i<j; i++) {
      dispatched = true;
      // get the platform specific key
      // check the key is down
      if(-1 !== _downKeys.indexOf(arguments[i])) {
        throw Error('Can\'t push a key already down ('+arguments[i]+')');
      }
      // register the newly down key
      _downKeys.push(arguments[i]);
      // dispatch the keydown event
      dispatched = this.dispatch(document.activeElement, {
          type: 'keydown',
          key: arguments[i]
        }) && dispatched;
      // dispatch the keypress event if the keydown has been dispatched
      // and the CTRL key is not pressed
      if(dispatched&&-1 === _downKeys.indexOf(this.CTRL)) {
        dispatched = this.dispatch(document.activeElement, {
          type: 'keypress',
          key: arguments[i]
        });
        // if keypress has been dispatched, try to input the char
        if(dispatched) {
          _inputChar(arguments[i]);
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
    options.key = options.key || 'Unidentified';
    options.repeat = !!options.repeat;
    if('string' !== typeof options.key) {
      throw Error('The key option must be a string.');
    }
    if(-1 !== this.KEYS.indexOf(options.key)) {
      char = this.KEY_TO_CHAR[options.key] || '';
    } else if(1 === options.key.length) {
      char = options.key;
    } else {
      throw Error('Unknown key value "'+key+'".')
    }
    charCode = char ? char.charCodeAt(0) : 0;
    keyCode = this.KEY_TO_CHARCODE[options.key] || charCode;
    // try to use the constructor (recommended with DOM level 3)
    // http://www.w3.org/TR/DOM-Level-3-Events/#new-event-interface-initializers
    try {
      event = new KeyboardEvent(options.type, {
        bubbles: options.canBubble,
        cancelable: options.cancelable,
        view: options.view,
        char: char,
        location: options.location,
        modifiers: modifiers,
        ctrlKey: -1 !== _downKeys.indexOf(this.CTRL),
        shiftKey: -1 !== _downKeys.indexOf(this.SHIFT),
        altKey: -1 !== _downKeys.indexOf(this.ALT),
        metaKey: -1 !== _downKeys.indexOf(this.META),
        repeat: options.repeat,
        locale: this.locale,
        // legacy
        charCode: charCode,
        which: keyCode,
        keyCode: keyCode
      });
      // Chrome seems to not set those properties properly
      utils.setEventProperty(event, 'char', char);
      utils.setEventProperty(event, 'charCode', charCode);
      utils.setEventProperty(event, 'keyCode', keyCode);
      return element.dispatchEvent(event);
    } catch(e) {
      if(document.createEvent) {
        event = document.createEvent('KeyboardEvent');
        if(typeof event.initKeyboardEvent !== 'undefined') {
          event.initKeyboardEvent(options.type,
            options.canBubble, options.cancelable,
            options.view || window, char, options.charCode,
            options.location, modifiers,
            options.repeat, this.locale);
        } else {
          event.initKeyEvent(options.type,
          'false' === options.canBubble ? false : true,
          'false' === options.cancelable ? false : true,
          options.view||window,
          -1 !== _downKeys.indexOf(this.CTRL), -1 !== _downKeys.indexOf(this.ALT),
          -1 !== _downKeys.indexOf(this.SHIFT), -1 !== _downKeys.indexOf(this.META),
          keyCode, charCode);
        }
        utils.setEventProperty(event, 'ctrlKey',
          -1 !== _downKeys.indexOf(this.CTRL));
        utils.setEventProperty(event, 'altKey',
          -1 !== _downKeys.indexOf(this.ALT));
        utils.setEventProperty(event, 'shiftKey',
          -1 !== _downKeys.indexOf(this.SHIFT));
        utils.setEventProperty(event, 'metaKey',
          -1 !== _downKeys.indexOf(this.META));
        utils.setEventProperty(event, 'keyCode', keyCode);
        utils.setEventProperty(event, 'which', keyCode);
        utils.setEventProperty(event, 'charCode', charCode);
        utils.setEventProperty(event, 'char', char);
        return element.dispatchEvent(event);
      } else if(document.createEventObject) {
        event = document.createEventObject();
        event.eventType = options.type;
        event.altKey = -1 !== _downKeys.indexOf(this.ALT);
        event.ctrlKey = -1 !== _downKeys.indexOf(this.CTRL);
        event.shiftKey = -1 !== _downKeys.indexOf(this.SHIFT);
        event.metaKey = -1 !== _downKeys.indexOf(this.META);
        event.keyCode = keyCode;
        event.charCode = charCode;
        event.char=char;
        return element.fireEvent('on'+options.type, event);
      }
    }
  }

}

module.exports = new Keyboard();

