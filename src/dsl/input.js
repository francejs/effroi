function Input(elementOrSelector) {
    
    var mouse = require('../devices/mouse.js');

    if (typeof elementOrSelector == 'string') {
        this.element = document.querySelector(elementOrSelector);
        if (!this.element) {
            throw new Error("Element not found using selector '" + elementOrSelector + "'");
        }
    } else {
        if (!(elementOrSelector instanceof HTMLElement)) {
            throw new Error("Invalid input() arg: only selector or HTMLElement are supported");
        }
        this.element = elementOrSelector;
    }

    this.val = function val() {
        return this.element.value;
    };

    this.set = function set(value) {
        try {
            this.element.focus();
        } catch (e) {
            throw new Error("Unable to focus() input field " + this.element.getAttribute('name') + ": " + e);
        }

        this.element.value = value;
    };

    this.fill = function fill(value, method) {
        method = method || 'paste';
        switch(method) {
            case 'paste':
                mouse.paste(this.element, value);
                break;
        }
    };
}

module.exports = function input(elementOrSelector) {
    return new Input(elementOrSelector);
};