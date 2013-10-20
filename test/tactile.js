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
      currentTarget : e.currentTarget,
      clientX : e.clientX,
      clientY : e.clientY,
      altKey : e.altKey,
      ctrlKey : e.ctrlKey,
      shiftKey : e.shiftKey,
      metaKey : e.metaKey,
      button : e.button,
      buttons : e.buttons,
      pointerType : e.pointerType,
      view : e.view,
      relatedTarget : e.relatedTarget
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

function init(innerHTML) {
  elt = document.createElement('div');
  elt.innerHTML = innerHTML || 'foo';
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
if(tactile.isConnected()) {

  describe("A tactile device", function() {

    beforeEach(function() {
      // Would like to put init here but seems impossible
    });

    afterEach(function() {
      // Would like to put uninit here but seems impossible
    });

      describe("touching the screen", function() {

          before(function() {
              init();
              regEventListener(elt, 'touchstart');
              regEventListener(elt, 'touchend');
              regEventListener(elt, 'click');
              regEventListener(document.body, 'touchstart');
              regEventListener(document.body, 'touchend');
              regEventListener(document.body, 'click');
          });

          after(uninit);

          it("should return true", function() {
             assert.equal(tactile.touch(elt),true);
          });

          if(document.elementFromPoint&&document.body.getBoundingClientRect) {
            it("should return right coords", function() {
              assert.equal(
                document.elementFromPoint(evts[0].clientX, evts[0].clientY),
                elt
              );
            });
          }

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

      describe("touching the screen and stop events", function() {

          before(function() {
              init();
              regEventListener(elt, 'touchstart', false, true);
              regEventListener(elt, 'touchend', false, true);
              regEventListener(elt, 'click', false, true);
              regEventListener(document.body, 'touchstart');
              regEventListener(document.body, 'touchend');
              regEventListener(document.body, 'click');
          });

          after(uninit);

          it("should return true", function() {
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

      describe("touching the screen while the touchend prevented", function() {

          before(function() {
              init();
              regEventListener(elt, 'touchstart');
              regEventListener(elt, 'touchend', false, false, true);
              regEventListener(elt, 'click');
              regEventListener(document.body, 'touchstart');
              regEventListener(document.body, 'touchend');
              regEventListener(document.body, 'click');
          });

          after(uninit);

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

      describe("touching the screen while the touchstart prevented", function() {

          before(function() {
              init();
              regEventListener(elt, 'touchstart', false, false, true);
              regEventListener(elt, 'touchend');
              regEventListener(elt, 'click');
              regEventListener(document.body, 'touchstart');
              regEventListener(document.body, 'touchend');
              regEventListener(document.body, 'click');
          });

          after(uninit);

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



      describe("touching the screen + pushing the ctrlKey", function() {

          before(function() {
              init();
              regEventListener(elt, 'touchstart');
              regEventListener(elt, 'touchend');
              regEventListener(elt, 'click');
              regEventListener(document.body, 'touchstart');
              regEventListener(document.body, 'touchend');
              regEventListener(document.body, 'click');
          });

          after(uninit);

          it("should return true", function() {
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

    describe("scrolling to an element", function() {

        before(function() {
            init('<p style="height:10000px; width:1000px; background:#F00;">Block 1</p>'
              +'<p style="height:10000px; width:1000px; background:#0F0;">Block 2</p>'
              +'<p style="height:10000px; width:1000px; background:#00F;">Block 3</p>');
            regEventListener(elt, 'touchstart');
            regEventListener(elt, 'touchmove');
            regEventListener(elt, 'touchend');
        });

        after(uninit);

        it("should return true if scrolled, false otherwise", function() {
            assert.equal(tactile.scrollTo(elt),
              (25048>window.innerHeight ? true : false));
        });

        it("should trigger a touchstart event", function() {
            if((25048>window.innerHeight)) {
              assert.equal(evts[0].type, 'touchstart');
            } else {
              assert.equal(evts[0], null);
            }
        });

        it("should trigger a touchend event", function() {
            if((25048>window.innerHeight)) {
              assert.equal(evts[0].type, 'touchstart');
            }
        });

    });

  });

}
