describe("Mouse device", function() {
	var mouse = effroi.mouse,
			assert = chai.assert;
	  describe("clicking an element", function() {
	  		var elt, evts;
	  		function regEventListener(elt, type, capture, stop, prevent) {
          elt.addEventListener(type, function(e) {
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
          }, capture);
	  		}

	      before(function() {
	          elt = document.createElement('div');
	          elt.innerHTML = 'foo';
	          document.body.appendChild(elt);
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
