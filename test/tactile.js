var tactile = effroi.tactile,
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

function unreg() {
	for(var i=listeners.length-1; i>=0; i--) {
		listeners[i].elt.removeEventListener(
			listeners[i].type, listeners[i].listener, listeners[i].capture);
	}
	evts=[];
	elt=null;
}

// Test tactile only if it's available
if(tactile.isConnected()) {

	describe("A tactile device", function() {

		  describe("touching the screen", function() {

		      before(function() {
		          elt = document.createElement('div');
		          elt.innerHTML = 'foo';
		          document.body.appendChild(elt);
		          regEventListener(elt, 'touchstart');
		          regEventListener(elt, 'touchend');
		          regEventListener(elt, 'click');
		          regEventListener(document.body, 'touchstart');
		          regEventListener(document.body, 'touchend');
		          regEventListener(document.body, 'click');
		      });

		      after(function() {
		          document.body.removeChild(elt);
		          unreg();
		      });

		      it("normally should return true", function() {
		         assert.equal(tactile.touch(elt),true);
		      });

		      it("should trigger a touchstart event on the element", function() {
		    		assert.equal(evts[0].type, 'touchstart');
		    		assert.equal(evts[0].target, elt);
		        assert.equal(evts[0].currentTarget, elt);
		      });

		      it("should bubble the touchstart event on the parent", function() {
		    		assert.equal(evts[1].type, 'touchstart');
		    		assert.equal(evts[1].target, elt);
		        assert.equal(evts[1].currentTarget, document.body);
		      });

		      it("should trigger a touchend event on the element", function() {
		    		assert.equal(evts[2].type, 'touchend');
		    		assert.equal(evts[2].target, elt);
		        assert.equal(evts[2].currentTarget, elt);
		      });

		      it("should bubble the touchend event on the parent", function() {
		    		assert.equal(evts[3].type, 'touchend');
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

	});

	describe("A tactile device", function() {

		  describe("touching the screen and stopped", function() {

		      before(function() {
		          elt = document.createElement('div');
		          elt.innerHTML = 'foo';
		          document.body.appendChild(elt);
		          regEventListener(elt, 'touchstart', false, true);
		          regEventListener(elt, 'touchend', false, true);
		          regEventListener(elt, 'click', false, true);
		          regEventListener(document.body, 'touchstart');
		          regEventListener(document.body, 'touchend');
		          regEventListener(document.body, 'click');
		      });

		      after(function() {
		          document.body.removeChild(elt);
		          unreg();
		      });

		      it("normally should return true", function() {
		         assert.equal(tactile.touch(elt),true);
		      });

		      it("should trigger a touchstart event on the element", function() {
		    		assert.equal(evts[0].type, 'touchstart');
		    		assert.equal(evts[0].target, elt);
		        assert.equal(evts[0].currentTarget, elt);
		      });

		      it("should not bubble the touchstart event on the parent", function() {
		    		assert.notEqual(evts[1].type, 'touchstart');
		      });

		      it("should trigger a touchend event on the element", function() {
		    		assert.equal(evts[1].type, 'touchend');
		    		assert.equal(evts[1].target, elt);
		        assert.equal(evts[1].currentTarget, elt);
		      });

		      it("should not bubble the touchend event on the parent", function() {
		    		assert.notEqual(evts[2].type, 'touchend');
		      });

		      it("should trigger a click event on the element", function() {
		    		assert.equal(evts[2].type, 'click');
		    		assert.equal(evts[2].target, elt);
		        assert.equal(evts[2].currentTarget, elt);
		      });

		      it("should not bubble the click event on the parent", function() {
		    		assert.equal(evts[3], null);
		      });

		  });

	});

	describe("A tactile device", function() {

		  describe("touching the screen while the touchend prevented", function() {

		      before(function() {
		          elt = document.createElement('div');
		          elt.innerHTML = 'foo';
		          document.body.appendChild(elt);
		          regEventListener(elt, 'touchstart');
		          regEventListener(elt, 'touchend', false, false, true);
		          regEventListener(elt, 'click');
		          regEventListener(document.body, 'touchstart');
		          regEventListener(document.body, 'touchend');
		          regEventListener(document.body, 'click');
		      });

		      after(function() {
		          document.body.removeChild(elt);
		          unreg();
		      });

		      it("should return false", function() {
		         assert.equal(tactile.touch(elt),false);
		      });

		      it("should trigger a touchstart event on the element", function() {
		    		assert.equal(evts[0].type, 'touchstart');
		    		assert.equal(evts[0].target, elt);
		        assert.equal(evts[0].currentTarget, elt);
		      });

		      it("should bubble the touchstart event on the parent", function() {
		    		assert.equal(evts[1].type, 'touchstart');
		    		assert.equal(evts[1].target, elt);
		        assert.equal(evts[1].currentTarget, document.body);
		      });

		      it("should trigger a touchend event on the element", function() {
		    		assert.equal(evts[2].type, 'touchend');
		    		assert.equal(evts[2].target, elt);
		        assert.equal(evts[2].currentTarget, elt);
		      });

		      it("should bubble the touchend event on the parent", function() {
		    		assert.equal(evts[3].type, 'touchend');
		    		assert.equal(evts[3].target, elt);
		        assert.equal(evts[3].currentTarget, document.body);
		      });

		      it("should not trigger a click event on the element", function() {
		    		assert.equal(evts[4], null);
		      });

		  });

	});

}
