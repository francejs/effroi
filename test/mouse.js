
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

describe("Mouse device", function() {
	var mouse = effroi.mouse,
			assert = chai.assert;
	  describe("clicking an element", function() {

	      before(function() {
	          elt = document.createElement('div');
	          elt.innerHTML = 'foo';
	          document.body.appendChild(elt);
	          listeners=[];
	          regEventListener(elt,'mousedown');
	          regEventListener(elt,'mouseup');
	          regEventListener(elt,'click');
	          regEventListener(document.body,'mousedown');
	          regEventListener(document.body,'mouseup');
	          regEventListener(document.body,'click');
	          evts=[];
	          mouse.click(elt);
	      });

	      after(function() {
	          document.body.removeChild(elt);
	          unreg();
	      });

	      it("should trigger a click event on the element", function() {
		    		assert.equal(evts[0].type,'click');
		    		assert.equal(evts[0].target,elt);
		        assert.equal(evts[0].currentTarget,elt);
	      });

	      it("should bubble the click event on the parent", function() {
		    		assert.equal(evts[1].type,'click');
		    		assert.equal(evts[1].target,elt);
		        assert.equal(evts[1].currentTarget,document.body);
	      });
	  });
});
