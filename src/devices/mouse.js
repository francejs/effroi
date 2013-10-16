function Mouse() {
    this.click = function click(selector) {
        return this.dispatch('click', selector);
    };

    /**
     * Dispatches a mouse event to the DOM element behind the provided selector.
     *
     * @param  String  type      Type of event to dispatch
     * @param  String  selector  A CSS3 selector to the element to click
     * @return Boolean
     */
    this.dispatch = function dispatch(type, selector) {
        var elt = document.querySelector(selector),
            event = this.supportsEventConstructors() ? this.createEvent(type, elt) : this.legacyCreateEvent(type, elt);
        if (!elt) {
            throw new Error("No element found for selector '" + selector + "'");
        } 
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
        var evt = document.createEvent("MouseEvents"),
            centerX = 1, centerY = 1;
        try {
            var pos = elt.getBoundingClientRect();
            centerX = Math.floor((pos.left + pos.right) / 2),
            centerY = Math.floor((pos.top + pos.bottom) / 2);
        } catch(e) {}
        evt.initMouseEvent(type, true, true, window, 1, 1, 1, centerX, centerY, false, false, false, false, 0, elt);
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