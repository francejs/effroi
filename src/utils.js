module.exports={
	setEventCoords: function(event, element) {
	  // FIXME : should calculate pageX/Y, clientX/Y, screenX/Y and use setEventProperty
		try {
			var rect = elt.getBoundingClientRect();
      event.pageX = Math.floor((rect.left + rect.right) / 2);
      event.pageY = Math.floor((rect.top + rect.bottom) / 2);
    } catch(e) {
      event.pageX = 1;
      event.pageY = 1;
    }
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
