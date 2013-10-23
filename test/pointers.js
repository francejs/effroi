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
      currentTarget : e.currentTarget,
      clientX : e.clientX,
      clientY : e.clientY,
      altKey : e.altKey,
      ctrlKey : e.ctrlKey,
      shiftKey : e.shiftKey,
      metaKey : e.metaKey,
      button : e.button,
      buttons : e.buttons,
      charCode : e.charCode,
      char : e.char,
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
if(pointers.isConnected()) {

  describe("Pointing device", function() {

    var prefix = (function () {
      var _prefixed = !!window.navigator.msPointerEnabled;
      return function (eventType) {
        return (_prefixed ? 'MSPointer' + eventType[7].toUpperCase()
            + eventType.substring(8) : eventType);
      };
    })();

    describe("pointing the screen", function() {

      before(function() {
        init();
        regEventListener(elt, prefix('pointerdown'));
        regEventListener(elt, prefix('pointerup'));
        regEventListener(elt, 'click');
        regEventListener(document.body, prefix('pointerdown'));
        regEventListener(document.body, prefix('pointerup'));
        regEventListener(document.body, 'click');
      });

      after(uninit);

      it("should return true", function() {
        assert.equal(pointers.point(elt), true);
      });

      it("should trigger a pointerdown event on the element", function() {
        assert.equal(evts[0].type, prefix('pointerdown'));
        assert.equal(evts[0].target, elt);
        assert.equal(evts[0].currentTarget, elt);
      });

      it("should bubble the pointerdown event on the parent", function() {
        assert.equal(evts[1].type, prefix('pointerdown'));
        assert.equal(evts[1].target, elt);
        assert.equal(evts[1].currentTarget, document.body);
      });

      it("should trigger a pointerup event on the element", function() {
        assert.equal(evts[2].type, prefix('pointerup'));
        assert.equal(evts[2].target, elt);
        assert.equal(evts[2].currentTarget, elt);
      });

      it("should bubble the pointerup event on the parent", function() {
        assert.equal(evts[3].type, prefix('pointerup'));
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
        regEventListener(elt, prefix('pointerdown'), false, true);
        regEventListener(elt, prefix('pointerup'), false, true);
        regEventListener(elt, 'click', false, true);
        regEventListener(document.body, prefix('pointerdown'));
        regEventListener(document.body, prefix('pointerup'));
        regEventListener(document.body, 'click');
      });

      after(uninit);

      it("should return true", function() {
        assert.equal(pointers.point(elt), true);
      });

      it("should trigger a pointerdown event on the element", function() {
        assert.equal(evts[0].type, prefix('pointerdown'));
        assert.equal(evts[0].target, elt);
        assert.equal(evts[0].currentTarget, elt);
      });

      it("should not bubble the pointerdown event on the parent", function() {
        assert.notEqual(evts[1].type, prefix('pointerdown'));
      });

      it("should trigger a pointerup event on the element", function() {
        assert.equal(evts[1].type, prefix('pointerup'));
        assert.equal(evts[1].target, elt);
        assert.equal(evts[1].currentTarget, elt);
      });

      it("should not bubble the pointerup event on the parent", function() {
        assert.notEqual(evts[2].type, prefix('pointerup'));
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

    describe("pointing the screen and cancelling pointerup", function() {

      before(function() {
        init();
        regEventListener(elt, prefix('pointerdown'));
        regEventListener(elt, prefix('pointerup'), false, false, true);
        regEventListener(elt, 'click');
        regEventListener(document.body, prefix('pointerdown'));
        regEventListener(document.body, prefix('pointerup'));
        regEventListener(document.body, 'click');
      });

      after(uninit);

      it("should return false for IE11, true otherwise", function() {
        assert.equal(pointers.point(elt),
          window.navigator.msPointerEnabled ? true : false);
      });

      it("should trigger a pointerdown event on the element", function() {
        assert.equal(evts[0].type, prefix('pointerdown'));
        assert.equal(evts[0].target, elt);
        assert.equal(evts[0].currentTarget, elt);
      });

      it("should bubble the pointerdown event on the parent", function() {
        assert.equal(evts[1].type, prefix('pointerdown'));
        assert.equal(evts[1].target, elt);
        assert.equal(evts[1].currentTarget, document.body);
      });

      it("should trigger a pointerup event on the element", function() {
        assert.equal(evts[2].type, prefix('pointerup'));
        assert.equal(evts[2].target, elt);
        assert.equal(evts[2].currentTarget, elt);
      });

      it("should bubble the pointerup event on the parent", function() {
        assert.equal(evts[3].type, prefix('pointerup'));
        assert.equal(evts[3].target, elt);
        assert.equal(evts[3].currentTarget, document.body);
      });

      it("should not trigger a click event on the element for IE11", function() {
        if(window.navigator.pointerEnabled) {
          assert.equal(evts[4], null);
        }
      });

    });

    describe("pointing the screen and cancelling pointerdown", function() {

      before(function() {
        init();
        regEventListener(elt, prefix('pointerdown'), false, false, true);
        regEventListener(elt, prefix('pointerup'));
        regEventListener(elt, 'click');
        regEventListener(document.body, prefix('pointerdown'));
        regEventListener(document.body, prefix('pointerup'));
        regEventListener(document.body, 'click');
      });

      after(uninit);

      it("should return false", function() {
        assert.equal(pointers.point(elt),
          window.navigator.msPointerEnabled ? true : false);
      });

      it("should trigger a pointerdown event on the element", function() {
        assert.equal(evts[0].type, prefix('pointerdown'));
        assert.equal(evts[0].target, elt);
        assert.equal(evts[0].currentTarget, elt);
      });

      it("should bubble the pointerdown event on the parent", function() {
        assert.equal(evts[1].type, prefix('pointerdown'));
        assert.equal(evts[1].target, elt);
        assert.equal(evts[1].currentTarget, document.body);
      });

      it("should trigger a pointerup event on the element", function() {
        assert.equal(evts[2].type, prefix('pointerup'));
        assert.equal(evts[2].target, elt);
        assert.equal(evts[2].currentTarget, elt);
      });

      it("should bubble the pointerup event on the parent", function() {
        assert.equal(evts[3].type, prefix('pointerup'));
        assert.equal(evts[3].target, elt);
        assert.equal(evts[3].currentTarget, document.body);
      });

      it("should not trigger a click event on the element for IE11", function() {
        if(window.navigator.pointerEnabled) {
          assert.equal(evts[4], null);
        }
      });

    });

    describe("clicking the screen", function() {

      before(function() {
        init();
        regEventListener(elt, prefix('pointerdown'));
        regEventListener(elt, prefix('pointerup'));
        regEventListener(elt, 'click');
      });

      after(uninit);

      it("should return true", function() {
        assert.equal(pointers.click(elt), true);
      });

      if(window.navigator.pointerEnabled) {
        it("should set pointerType to 'mouse' on IE11+", function() {
          assert.equal(evts[0].pointerType, 'mouse');
          assert.equal(evts[1].pointerType, 'mouse');
          assert.equal(evts[2].pointerType, 'mouse');
        });
      } else {
        it("should set pointerType to 4 on IE10", function() {
          assert.equal(evts[0].pointerType, 4);
          assert.equal(evts[1].pointerType, 4);
          assert.equal(evts[2].pointerType, undefined); // IE10 click is a MouseEvent
        });
      }

      it("should set button to 0", function() {
        assert.equal(evts[0].button, 0);
        assert.equal(evts[1].button, 0);
        assert.equal(evts[1].button, 0);
      });

    });

    describe("touching the screen", function() {

      before(function() {
        init();
        regEventListener(elt, prefix('pointerdown'));
        regEventListener(elt, prefix('pointerup'));
        regEventListener(elt, 'click');
      });

      after(uninit);

      it("should return true", function() {
        assert.equal(pointers.touch(elt), true);
      });

      if(window.navigator.pointerEnabled) {
        it("should set pointerType to 'touch' on IE11+", function() {
          assert.equal(evts[0].pointerType, 'touch');
          assert.equal(evts[1].pointerType, 'touch');
          assert.equal(evts[2].pointerType, 'touch');
        });
      } else {
        it("should set pointerType to 2 on IE10", function() {
          assert.equal(evts[0].pointerType, 2);
          assert.equal(evts[1].pointerType, 2);
          assert.equal(evts[2].pointerType, undefined); // IE10 click is a MouseEvent
        });
      }

      it("should set button to 0", function() {
        assert.equal(evts[0].button, 0);
        assert.equal(evts[1].button, 0);
        assert.equal(evts[1].button, 0);
      });

    });

    describe("pointing the screen with a pen", function() {

      before(function() {
        init();
        regEventListener(elt, prefix('pointerdown'));
        regEventListener(elt, prefix('pointerup'));
        regEventListener(elt, 'click');
      });

      after(uninit);

      it("should return true", function() {
        assert.equal(pointers.pen(elt), true);
      });

      if(window.navigator.pointerEnabled) {
        it("should set pointerType to 'touch' on IE11+", function() {
          assert.equal(evts[0].pointerType, 'pen');
          assert.equal(evts[1].pointerType, 'pen');
          assert.equal(evts[2].pointerType, 'pen');
        });
      } else {
        it("should set pointerType to 2 on IE10", function() {
          assert.equal(evts[0].pointerType, 3);
          assert.equal(evts[1].pointerType, 3);
          assert.equal(evts[2].pointerType, undefined); // IE10 click is a MouseEvent
        });
      }

      it("should set button to 0", function() {
        assert.equal(evts[0].button, 0);
        assert.equal(evts[1].button, 0);
        assert.equal(evts[1].button, 0);
      });

    });

    describe("clicking an undisplayed element", function() {

        before(function() {
            init('<p>Text</p><p><a href="#" style="display:none">A link</a></p>');
        });

        after(uninit);

        it("should throw an exception", function() {
          assert.throw(function() {
            pointers.dispatch(elt.lastChild.firstChild, {type: 'pointerdown'});
          }, Error, 'Unable to find a point in the viewport at wich the'
            +' given element can receive a pointer event.');
        });

    });

    describe("clicking an hidden element", function() {

        before(function() {
            init('<p>Text</p><p><a href="#" style="visibility:hidden">A link</a></p>');
        });

        after(uninit);

        it("should throw an exception", function() {
          assert.throw(function() {
            pointers.dispatch(elt.lastChild.firstChild, {type: 'pointerdown'});
          }, Error, 'Unable to find a point in the viewport at wich the'
            +' given element can receive a pointer event.');
        });

    });

    describe("clicking a pointer disabled element", function() {

        before(function() {
            init('<p>Text</p><p><a href="#" style="pointer-events:none">A link</a></p>');
        });

        after(uninit);

        it("should throw an exception", function() {
          assert.throw(function() {
            pointers.dispatch(elt.lastChild.firstChild, {type: 'pointerdown'});
          }, Error, 'Unable to find a point in the viewport at wich the'
            +' given element can receive a pointer event.');
        });

    });

    describe("clicking an unclickable element", function() {

        before(function() {
            init('<p>Text</p><p><a href="#"><span style="display:block; width:100%; height:100%;">A link</span></a></p>');
        });

        after(uninit);

        it("should throw an exception", function() {
          assert.throw(function() {
            pointers.dispatch(elt.lastChild.firstChild, {type: 'pointerdown'});
          }, Error, 'Unable to find a point in the viewport at wich the'
            +' given element can receive a pointer event.');
        });

    });

  });

}
