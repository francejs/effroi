module.exports={

	setEventCoords: function(event, element) {
	  var c = this.getElementCenter(element);
    this.setEventProperty(event, 'clientX', c.x);
    this.setEventProperty(event, 'clientY', c.y);
    this.setEventProperty(event, 'pageX', c.x+window.scrollX);
    this.setEventProperty(event, 'pageY', c.y+window.scrollY);
	},

	getElementCenter: function(element) {
	  var c={};
		try {
			var rect = element.getBoundingClientRect();
      c.x = Math.floor((rect.left + rect.right) / 2);
      c.y = Math.floor((rect.top + rect.bottom) / 2);
    } catch(e) {
      c.x = 1;
      c.y = 1;
    }
	  return c;
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
