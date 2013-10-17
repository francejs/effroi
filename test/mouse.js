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
			currentTarget : e.currentTarget,
			altKey : e.altKey,
			ctrlKey : e.ctrlKey,
			shiftKey : e.shiftKey,
			metaKey : e.metaKey,
			button : e.button
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

	      it("should set the button property to 0", function() {
		        assert.equal(evts[0].button, 1);
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

	  describe("clicking an element with altKey pushed", function() {

	      before(function() {
	      		init();
	          regEventListener(elt, 'click');
	          
	      });

	      after(uninit);

	      it("should return true", function() {
		    		assert.equal(mouse.click(elt, {
		    		  altKey : true
		    		}), true);
	      });

	      it("should set the altKey property to true", function() {
		        assert.equal(evts[0].altKey, true);
	      });

	  });

	  describe("clicking an element with ctrlKey pushed", function() {

	      before(function() {
	      		init();
	          regEventListener(elt, 'click');
	          
	      });

	      after(uninit);

	      it("should return true", function() {
		    		assert.equal(mouse.click(elt, {
		    		  ctrlKey : true
		    		}), true);
	      });

	      it("should set the ctrlKey property to true", function() {
		        assert.equal(evts[0].ctrlKey, true);
	      });

	  });

	  describe("clicking an element with shiftKey pushed", function() {

	      before(function() {
	      		init();
	          regEventListener(elt, 'click');
	      });

	      after(uninit);

	      it("should return true", function() {
		    		assert.equal(mouse.click(elt, {
		    		  shiftKey : true
		    		}), true);
	      });

	      it("should set the shiftKey property to true", function() {
		        assert.equal(evts[0].shiftKey, true);
	      });

	  });

	  describe("clicking an element with metaKey pushed", function() {

	      before(function() {
	      		init();
	          regEventListener(elt, 'click');
	      });

	      after(uninit);

	      it("should return true", function() {
		    		assert.equal(mouse.click(elt, {
		    		  metaKey : true
		    		}), true);
	      });

	      it("should set the ctrlKey property to true", function() {
		        assert.equal(evts[0].metaKey, true);
	      });

	  });

	  describe("clicking an element with ctrlKey pushed", function() {

	      before(function() {
	      		init();
	          regEventListener(elt, 'click');
	      });

	      after(uninit);

	      it("should return true", function() {
		    		assert.equal(mouse.click(elt, {
		    		  ctrlKey : true
		    		}), true);
	      });

	      it("should set the ctrlKey property to true", function() {
		        assert.equal(evts[0].ctrlKey, true);
	      });

	  });

	  describe("clicking an element with the middle button", function() {

	      before(function() {
	      		init();
	          regEventListener(elt, 'click');
	      });

	      after(uninit);

	      it("should return true", function() {
		    		assert.equal(mouse.click(elt, {
		    		  button : 1
		    		}), true);
	      });

	      it("should set the button property to 1", function() {
		        assert.equal(evts[0].button, 1);
	      });

	  });

	  describe("clicking an element with the right button", function() {

	      before(function() {
	      		init();
	          regEventListener(elt, 'click');
	      });

	      after(uninit);

	      it("should return true", function() {
		    		assert.equal(mouse.click(elt, {
		    		  button : 2
		    		}), true);
	      });

	      it("should set the button property to 2", function() {
		        assert.equal(evts[0].button, 2);
	      });

	  });

});
