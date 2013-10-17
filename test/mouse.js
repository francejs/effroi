var mouse = effroi.mouse,
		assert = chai.assert;

// Helper
var elt, evts=[], listeners=[];
function regEventListener(elt, type, capture, stop, prevent) {
	var listener=function(e) {
		if(e.type!=type) {
			throw 'Event types differs.'
		}
		evts.push({
			type : e.type,
			target : e.target,
			currentTarget : e.currentTarget
		});
		if(stop) {
			e.stopPropagation();
		}
		if(prevent) {
			e.preventDefault();
		}
  };
  elt.addEventListener(type, listener, capture);
  listeners.push({
  	elt: elt,
  	type: type,
  	listener : listener,
  	capture : capture
 	});
}

function init() {
  elt = document.createElement('div');
  elt.innerHTML = 'foo';
  document.body.appendChild(elt);	
}

function uninit() {
  document.body.removeChild(elt);
	for(var i=listeners.length-1; i>=0; i--) {
		listeners[i].elt.removeEventListener(
			listeners[i].type, listeners[i].listener, listeners[i].capture);
	}
	evts=[];
	elt=null;
}

describe("Mouse device", function() {

	  describe("clicking an element", function() {

	      before(function() {
	      		init();
	          regEventListener(elt, 'mousedown');
	          regEventListener(elt, 'mouseup');
	          regEventListener(elt, 'click');
	          regEventListener(document.body, 'mousedown');
	          regEventListener(document.body, 'mouseup');
	          regEventListener(document.body, 'click');
	          
	      });

	      after(uninit);

	      it("should return true", function() {
		    		assert.equal(mouse.click(elt), true);
	      });

	      it("should trigger a mousedown event on the element", function() {
		    		assert.equal(evts[0].type, 'mousedown');
		    		assert.equal(evts[0].target, elt);
		        assert.equal(evts[0].currentTarget, elt);
	      });

	      it("should bubble the mousedown event on the parent", function() {
		    		assert.equal(evts[1].type, 'mousedown');
		    		assert.equal(evts[1].target, elt);
		        assert.equal(evts[1].currentTarget, document.body);
	      });

	      it("should trigger a mouseup event on the element", function() {
		    		assert.equal(evts[2].type, 'mouseup');
		    		assert.equal(evts[2].target, elt);
		        assert.equal(evts[2].currentTarget, elt);
	      });

	      it("should bubble the mouseup event on the parent", function() {
		    		assert.equal(evts[3].type, 'mouseup');
		    		assert.equal(evts[3].target, elt);
		        assert.equal(evts[3].currentTarget, document.body);
	      });

	      it("should trigger a click event on the element", function() {
		    		assert.equal(evts[4].type, 'click');
		    		assert.equal(evts[4].target, elt);
		        assert.equal(evts[4].currentTarget, elt);
	      });

	      it("should bubble the click event on the parent", function() {
		    		assert.equal(evts[5].type, 'click');
		    		assert.equal(evts[5].target, elt);
		        assert.equal(evts[5].currentTarget, document.body);
	      });

	  });

	  describe("clicking an element and stop events", function() {

	      before(function() {
	      		init();
	          regEventListener(elt, 'mousedown', false, true);
	          regEventListener(elt, 'mouseup', false, true);
	          regEventListener(elt, 'click', false, true);
	          regEventListener(document.body, 'mousedown');
	          regEventListener(document.body, 'mouseup');
	          regEventListener(document.body, 'click');
	          
	      });

	      after(uninit);

	      it("should return true", function() {
		    		assert.equal(mouse.click(elt), true);
	      });

	      it("should trigger a mousedown event on the element", function() {
		    		assert.equal(evts[0].type, 'mousedown');
		    		assert.equal(evts[0].target, elt);
		        assert.equal(evts[0].currentTarget, elt);
	      });

	      it("should not bubble the mousedown event on the parent", function() {
		    		assert.notEqual(evts[1].type, 'mousedown');
	      });

	      it("should trigger a mouseup event on the element", function() {
		    		assert.equal(evts[1].type, 'mouseup');
		    		assert.equal(evts[1].target, elt);
		        assert.equal(evts[1].currentTarget, elt);
	      });

	      it("should not bubble the mouseup event on the parent", function() {
		    		assert.notEqual(evts[2].type, 'mouseup');
	      });

	      it("should trigger a click event on the element", function() {
		    		assert.equal(evts[2].type,'click');
		    		assert.equal(evts[2].target,elt);
		        assert.equal(evts[2].currentTarget,elt);
	      });

	      it("should not bubble the click event on the parent", function() {
		    		assert.equal(evts[3], null);
	      });

	  });

	  describe("clicking an element and stop mouseup", function() {

	      before(function() {
	      		init();
	          regEventListener(elt, 'mousedown');
	          regEventListener(elt, 'mouseup', false, false, true);
	          regEventListener(elt, 'click');
	          regEventListener(document.body, 'mousedown');
	          regEventListener(document.body, 'mouseup');
	          regEventListener(document.body, 'click');
	          
	      });

	      after(uninit);

	      it("should return false", function() {
		    		assert.equal(mouse.click(elt), false);
	      });

	      it("should trigger a mousedown event on the element", function() {
		    		assert.equal(evts[0].type, 'mousedown');
		    		assert.equal(evts[0].target, elt);
		        assert.equal(evts[0].currentTarget, elt);
	      });

	      it("should bubble the mousedown event on the parent", function() {
		    		assert.equal(evts[1].type, 'mousedown');
		    		assert.equal(evts[1].target, elt);
		        assert.equal(evts[1].currentTarget, document.body);
	      });

	      it("should trigger a mouseup event on the element", function() {
		    		assert.equal(evts[2].type, 'mouseup');
		    		assert.equal(evts[2].target, elt);
		        assert.equal(evts[2].currentTarget, elt);
	      });

	      it("should bubble the mouseup event on the parent", function() {
		    		assert.equal(evts[3].type, 'mouseup');
		    		assert.equal(evts[3].target, elt);
		        assert.equal(evts[3].currentTarget, document.body);
	      });

	      it("should not trigger a click event", function() {
		    		assert.equal(evts[4], null);
	      });

	  });

	  describe("clicking an element and stop mousedown", function() {

	      before(function() {
	      		init();
	          regEventListener(elt, 'mousedown', false, false, true);
	          regEventListener(elt, 'mouseup');
	          regEventListener(elt, 'click');
	          regEventListener(document.body, 'mousedown');
	          regEventListener(document.body, 'mouseup');
	          regEventListener(document.body, 'click');
	          
	      });

	      after(uninit);

	      it("should return false", function() {
		    		assert.equal(mouse.click(elt), false);
	      });

	      it("should trigger a mousedown event on the element", function() {
		    		assert.equal(evts[0].type, 'mousedown');
		    		assert.equal(evts[0].target, elt);
		        assert.equal(evts[0].currentTarget, elt);
	      });

	      it("should bubble the mousedown event on the parent", function() {
		    		assert.equal(evts[1].type, 'mousedown');
		    		assert.equal(evts[1].target, elt);
		        assert.equal(evts[1].currentTarget, document.body);
	      });

	      it("should trigger a mouseup event on the element", function() {
		    		assert.equal(evts[2].type, 'mouseup');
		    		assert.equal(evts[2].target, elt);
		        assert.equal(evts[2].currentTarget, elt);
	      });

	      it("should bubble the mouseup event on the parent", function() {
		    		assert.equal(evts[3].type, 'mouseup');
		    		assert.equal(evts[3].target, elt);
		        assert.equal(evts[3].currentTarget, document.body);
	      });

	      it("should not trigger a click event", function() {
		    		assert.equal(evts[4], null);
	      });

	  });

});
