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
		return !mouse.click(element);
	}


	return {
		isConnected : isConnected,
		tactile : tactile,
		touch : touch
	};

})();

module.exports = Tactile;
