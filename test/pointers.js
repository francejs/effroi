var pointers = effroi.pointers,
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

// Test tactile only if it's available
if(pointers.isConnected()) {

	describe("Pointing device", function() {

		describe("pointing the screen", function() {

			before(function() {
				init();
				regEventListener(elt, 'MSPointerDown');
				regEventListener(elt, 'MSPointerUp');
				regEventListener(elt, 'click');
				regEventListener(document.body, 'MSPointerDown');
				regEventListener(document.body, 'MSPointerUp');
				regEventListener(document.body, 'click');
			});

			after(uninit);

			it("should return true", function() {
				assert.equal(pointers.point(elt), true);
			});

			it("should trigger a MSPointerDown event on the element", function() {
				assert.equal(evts[0].type, 'MSPointerDown');
				assert.equal(evts[0].target, elt);
				assert.equal(evts[0].currentTarget, elt);
			});

			it("should bubble the MSPointerDown event on the parent", function() {
				assert.equal(evts[1].type, 'MSPointerDown');
				assert.equal(evts[1].target, elt);
				assert.equal(evts[1].currentTarget, document.body);
			});

			it("should trigger a MSPointerUp event on the element", function() {
				assert.equal(evts[2].type, 'MSPointerUp');
				assert.equal(evts[2].target, elt);
				assert.equal(evts[2].currentTarget, elt);
			});

			it("should bubble the MSPointerUp event on the parent", function() {
				assert.equal(evts[3].type, 'MSPointerUp');
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

		describe("pointing the screen and stop events", function() {

			before(function() {
				init();
				regEventListener(elt, 'MSPointerDown', false, true);
				regEventListener(elt, 'MSPointerUp', false, true);
				regEventListener(elt, 'click', false, true);
				regEventListener(document.body, 'MSPointerDown');
				regEventListener(document.body, 'MSPointerUp');
				regEventListener(document.body, 'click');
			});

			after(uninit);

			it("should return true", function() {
				assert.equal(pointers.point(elt), true);
			});

			it("should trigger a MSPointerDown event on the element", function() {
				assert.equal(evts[0].type, 'MSPointerDown');
				assert.equal(evts[0].target, elt);
				assert.equal(evts[0].currentTarget, elt);
			});

			it("should not bubble the MSPointerDown event on the parent", function() {
				assert.notEqual(evts[1].type, 'MSPointerDown');
			});

			it("should trigger a MSPointerUp event on the element", function() {
				assert.equal(evts[1].type, 'MSPointerUp');
				assert.equal(evts[1].target, elt);
				assert.equal(evts[1].currentTarget, elt);
			});

			it("should not bubble the MSPointerUp event on the parent", function() {
				assert.notEqual(evts[2].type, 'MSPointerUp');
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

		describe("pointing the screen and cancelling MSPointerUp", function() {

			before(function() {
				init();
				regEventListener(elt, 'MSPointerDown');
				regEventListener(elt, 'MSPointerUp', false, false, true);
				regEventListener(elt, 'click');
				regEventListener(document.body, 'MSPointerDown');
				regEventListener(document.body, 'MSPointerUp');
				regEventListener(document.body, 'click');
			});

			after(uninit);

			it("should return false", function() {
				assert.equal(pointers.point(elt), false);
			});

			it("should trigger a MSPointerDown event on the element", function() {
				assert.equal(evts[0].type, 'MSPointerDown');
				assert.equal(evts[0].target, elt);
				assert.equal(evts[0].currentTarget, elt);
			});

			it("should bubble the MSPointerDown event on the parent", function() {
				assert.equal(evts[1].type, 'MSPointerDown');
				assert.equal(evts[1].target, elt);
				assert.equal(evts[1].currentTarget, document.body);
			});

			it("should trigger a MSPointerUp event on the element", function() {
				assert.equal(evts[2].type, 'MSPointerUp');
				assert.equal(evts[2].target, elt);
				assert.equal(evts[2].currentTarget, elt);
			});

			it("should bubble the MSPointerUp event on the parent", function() {
				assert.equal(evts[3].type, 'MSPointerUp');
				assert.equal(evts[3].target, elt);
				assert.equal(evts[3].currentTarget, document.body);
			});

			it("should not trigger a click event on the element", function() {
				assert.equal(evts[4], null);
			});

		});

		describe("pointing the screen and cancelling MSPointerDown", function() {

			before(function() {
				init();
				regEventListener(elt, 'MSPointerDown', false, false, true);
				regEventListener(elt, 'MSPointerUp');
				regEventListener(elt, 'click');
				regEventListener(document.body, 'MSPointerDown');
				regEventListener(document.body, 'MSPointerUp');
				regEventListener(document.body, 'click');
			});

			after(uninit);

			it("should return false", function() {
				assert.equal(pointers.point(elt), false);
			});

			it("should trigger a MSPointerDown event on the element", function() {
				assert.equal(evts[0].type, 'MSPointerDown');
				assert.equal(evts[0].target, elt);
				assert.equal(evts[0].currentTarget, elt);
			});

			it("should bubble the MSPointerDown event on the parent", function() {
				assert.equal(evts[1].type, 'MSPointerDown');
				assert.equal(evts[1].target, elt);
				assert.equal(evts[1].currentTarget, document.body);
			});

			it("should trigger a MSPointerUp event on the element", function() {
				assert.equal(evts[2].type, 'MSPointerUp');
				assert.equal(evts[2].target, elt);
				assert.equal(evts[2].currentTarget, elt);
			});

			it("should bubble the MSPointerUp event on the parent", function() {
				assert.equal(evts[3].type, 'MSPointerUp');
				assert.equal(evts[3].target, elt);
				assert.equal(evts[3].currentTarget, document.body);
			});

			it("should not trigger a click event on the element", function() {
				assert.equal(evts[4], null);
			});

		});


	});

}
