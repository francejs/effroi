module.exports={
	'setEventCoords': function(event, element) {
		try {
			var rect = elt.getBoundingClientRect();
      event.pageX = Math.floor((rect.left + rect.right) / 2);
      event.pageY = Math.floor((rect.top + rect.bottom) / 2);
    } catch(e) {
      event.pageX = 1;
      event.pageY = 1;
    }
	}
};
