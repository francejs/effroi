function Mouse() {

		var utils = require('../utils.js');

    this.click = function click(elt) {
    		var dispatched=this.dispatch('mousedown', elt);
    		if(this.dispatch('mouseup', elt)&&dispatched) {
        	return this.dispatch('click', elt);
        }
        return false;
    };

    this._click = function click(elt) {
        return this.dispatch('click', elt);
    };

  /**
   * Dispatches a mouse event to the DOM element behind the provided selector.
   *
   * @param  String  type      Type of event to dispatch
   * @param  DOMElement  elt  A DOMElement to click
   * @return Boolean
   */
  this.dispatch = function dispatch(type, elt) {
      var event = this.supportsEventConstructors() ?
      	this.createEvent(type, elt) :
      	this.legacyCreateEvent(type, elt);
        return elt.dispatchEvent(event);
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
