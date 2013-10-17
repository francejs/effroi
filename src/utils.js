module.exports={
	setEventCoords: function(event, element) {
	  var x, y;
		try {
			var rect = elt.getBoundingClientRect();
      x = Math.floor((rect.left + rect.right) / 2);
      y = Math.floor((rect.top + rect.bottom) / 2);
    } catch(e) {
      x = 1;
      y = 1;
    }
    this.setEventProperty(event, 'clientX', x);
    this.setEventProperty(event, 'clientY', y);
    this.setEventProperty(event, 'pageX', x+window.scrollX);
    this.setEventProperty(event, 'pageY', y+window.scrollY);
	},
	setEventProperty: function(event, property, value) {
		try {
				Object.defineProperty(event, property, {
					get : function() {
						return value;
					}
				});
			} catch(e) {
				event[property]=value;
			}
	},
  supportsEventConstructors : ((function () {
    try {
      return new Event('submit', { bubbles: false }).bubbles === false
        && new Event('submit', { bubbles: true }).bubbles === true;
    } catch (e) {
      return false;
    }
  })())
};
