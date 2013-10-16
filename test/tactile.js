var tactile = effroi.tactile,
    assert = chai.assert;

// Test tactile only if it's available
if(tactile.isConnected()) {
	describe("Tactile device", function() {

		  describe("touching the screen", function() {
		  		var elt, evts;
		  		function regEventListener(elt, type, capture) {
	          elt.addEventListener(type, function(e) {
		  				if(e.type!=type) {
		  					throw 'Event types differs.'
		  				}
		  				evts.push(e);
	          }, capture);
		  		}

		      before(function() {
		          elt = document.createElement('div');
		          elt.innerHTML = 'foo';
		          document.body.appendChild(elt);
		          regEventListener(elt,'touchstart');
		          regEventListener(elt,'touchend');
		          regEventListener(elt,'click');
		          regEventListener(document.body,'touchstart');
		          regEventListener(document.body,'touchend');
		          regEventListener(document.body,'click');
		          evts=[];
		          tactile.touch(elt);
		      });

		      after(function() {
		          document.body.removeChild(elt);
		      });

		      it("should trigger a touchstart event on the element", function() {
		          assert(evts.some(function(evt) {
		          	return 'touchstart'===evt.type&&evt.target===elt;
		          }));
		      });

		      it("should trigger a touchend event on the element", function() {
		          assert(evts.some(function(evt) {
		          	return 'touchend'===evt.type&&evt.target===elt;
		          }));
		      });

		      it("should trigger a click event on the element", function() {
		          assert(evts.some(function(evt) {
		          	return 'click'===evt.type&&evt.target===elt;
		          }));
		      });
		  });
	});
}
