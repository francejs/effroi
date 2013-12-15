function Element(selector) {
    
    var mouse = require('../devices/mouse.js');

    this.selector = selector;
    this.element = document.querySelector(selector);
    if (!this.element) {
        throw new Error("Element not found using selector '" + selector + "'");
    }

    this.isVisible = function isVisible() {
        try {
            var comp = window.getComputedStyle(this.element, null);
            return comp.visibility !== 'hidden' &&
                   comp.display !== 'none' &&
                   this.element.offsetHeight > 0 &&
                   this.element.offsetWidth > 0;
        } catch (e) {console.log(e);
            return false;
        }
    };

    this.click = function click() {
        return mouse.click(this.element);
    };

    this.dblclick = function dblclick() {
        return mouse.dblclick(this.element);
    };
}

module.exports = function element(selector) {
    return new Element(selector);
};
