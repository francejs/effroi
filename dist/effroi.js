(function(e){if("function"==typeof bootstrap)bootstrap("effroi",e);else if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else if("undefined"!=typeof ses){if(!ses.ok())return;ses.makeEffroi=e}else"undefined"!=typeof window?window.effroi=e():global.effroi=e()})(function(){var define,ses,bootstrap,module,exports;
return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
function Mouse() {

		var utils = require('../utils.js');

    this.click = function click(elt) {
        return this.dispatch('click', elt);
    };

    this.dispatch = function dispatch(type, elt) {
        var event = this.supportsEventConstructors() ?
        	this.createEvent(type, elt) :
        	this.legacyCreateEvent(type, elt);
        var canceled = !elt.dispatchEvent(event);
        return canceled;
    };

    this.createEvent = function createEvent(type, elt) {
        return new MouseEvent(type, {
            'view': window,
            'bubbles': true,
            'cancelable': true
        });
    };

    this.legacyCreateEvent = function legacyCreateEvent(type, elt) {
        var evt = document.createEvent("MouseEvents");
        utils.setEventCoords(evt, elt);
        evt.initMouseEvent(type, true, true, window, 1, 1, 1,
        	evt.pageX, evt.pageY, false, false, false, false, 0, elt);
        return evt;
    };

    this.supportsEventConstructors = function supportsEventConstructors() {
        try {
            if (new Event('submit', { bubbles: false }).bubbles !== false) {
                return false;
            } else if (new Event('submit', { bubbles: true }).bubbles !== true) {
                return false
            } else {
                return true;
            }
        } catch (e) {
            return false;
        }
    };
};

module.exports = new Mouse();

},{"../utils.js":4}],2:[function(require,module,exports){
var Tactile=(function () {

	// Neeed mouse to perform click
	var mouse = require('./mouse.js');
	var utils = require('../utils.js');

	// Detect the tactile device
	function isConnected () {
		return !!('ontouchstart' in window);
	}

	// Trigger tactile events
	function tactile (element,options) {
		options=options||{};
		var event = document.createEvent('UIEvent');
		event.initUIEvent(options.type,
			'false' === options.canBubble ? false : true,
			'false' === options.cancelable ? false : true,
			options.view||window,
			options.detail||1);
		event.view = options.view||window;
		event.altKey = !!options.altKey;
		event.ctrlKey = !!options.ctrlKey;
		event.shiftKey = !!options.shiftKey;
		event.metaKey = !!options.metaKey;
	  utils.setEventCoords(event, element);
		return element.dispatchEvent(event);
	}

	// Touch the screen and release
	function touch (element,options) {
		var dispatched;
		options=options||{};
		options.type='touchstart';
		dispatched=tactile(element, options);
		options.type='touchend';
		if(!(tactile(element, options)&&dispatched)) {
			return false;
		}
		return mouse.click(element);
	}


	return {
		isConnected : isConnected,
		tactile : tactile,
		touch : touch
	};

})();

module.exports = Tactile;

},{"../utils.js":4,"./mouse.js":1}],3:[function(require,module,exports){
module.exports.mouse = require('./devices/mouse.js');
module.exports.tactile = require('./devices/tactile.js');

},{"./devices/mouse.js":1,"./devices/tactile.js":2}],4:[function(require,module,exports){
module.exports={
	'setEventCoords': function(event, element) {
		try {
			var rect = elt.getBoundingClientRect();
      event.pageX = Math.floor((rect.left + rect.right) / 2);
      event.pageY = Math.floor((rect.top + rect.bottom) / 2);
    } catch(e) {
      event.pageX = 1;
      event.pageY = 1;
    }
	}
};

},{}]},{},[3])
(3)
});
;