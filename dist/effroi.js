!function(e){"object"==typeof exports?module.exports=e():"function"==typeof define&&define.amd?define(e):"undefined"!=typeof window?window.effroi=e():"undefined"!=typeof global?global.effroi=e():"undefined"!=typeof self&&(self.effroi=e())}(function(){var define,module,exports;
return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
function Mouse() {
    this.click = function click(selector) {
        return this.dispatch('click', selector);
    };

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
},{}],2:[function(require,module,exports){
module.exports.mouse = require('./devices/mouse.js');
},{"./devices/mouse.js":1}]},{},[2])
(2)
});
;