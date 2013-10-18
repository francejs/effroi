function Tactile() {

  // Neeed mouse to perform click
  var mouse = require('./mouse.js');
  var utils = require('../utils.js');

  // Detect the tactile device
  this.isConnected = function () {
    return !!('ontouchstart' in window);
  };

  // Trigger tactile events
  this.dispatch = function (element,options) {
    options=options||{};
    var event
    if(utils.supportsEventConstructors) {
      event = new UIEvent(options.type, {
        'view': options.view||window,
        'bubbles': 'false' === options.canBubble ? false : true,
        'cancelable': 'false' === options.cancelable ? false : true
      });
    } else {
      event = document.createEvent('UIEvent');
      event.initUIEvent(options.type,
        'false' === options.canBubble ? false : true,
        'false' === options.cancelable ? false : true,
        options.view||window,
        options.detail||1);
    }
    return element.dispatchEvent(event);
  };

  // Touch the screen and release
  this.touch = function (element,options) {
    var dispatched;
    options=options||{};
    options.type='touchstart';
    dispatched=this.dispatch(element, options);
    options.type='touchend';
    if(this.dispatch(element, options)&&dispatched) {
      options.type='click';
      return mouse.dispatch(element, options);
    }
    return false;
  };

}

module.exports = new Tactile();
