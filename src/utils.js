module.exports={

  setEventCoords: function(event, x, y) {
    this.setEventProperty(event, 'clientX', x);
    this.setEventProperty(event, 'clientY', y);
    this.setEventProperty(event, 'pageX', x + window.scrollX);
    this.setEventProperty(event, 'pageY', y + window.scrollY);
  },

  // Find the center of an element
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

  // Find a point in the viewport at wich an element can be the root of
  // a pointer event (is not under another element)
  getPossiblePointerCoords: function(element) {
    var comp, rects, coords = null;
    comp = window.getComputedStyle(element, null);
    rects=element.getClientRects();
    if('none' !== comp.pointerEvents && rects.length) {
      mainLoop: for(var i=rects.length-1; i>=0; i--) {
        for(var x=rects[i].left, mX=rects[i].right; x<mX; x++) {
          for(var y=rects[i].top, mY=rects[i].bottom; y<mY; y++) {
            if(element === document.elementFromPoint(x,y)) {
              coords = {x: x, y: y};
              break mainLoop;
            }
          }
        }
      }
    }
    return coords;
  },

  // Set event property with a Chromium specific hack
  setEventProperty: function(event, property, value) {
    try {
      Object.defineProperty(event, property, {
        get : function() {
          return value;
        }
      });
    } catch(e) {
      event[property] = value;
    }
  }

};
