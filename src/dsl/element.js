function Element(selector) {
    this.selector = selector;
    this.element = document.querySelector(selector);
    if (!this.element) {
        throw new Error("Element not found using selector '" + selector + "'");
    }
}

module.exports = function element(selector) {
    return new Element(selector);
};