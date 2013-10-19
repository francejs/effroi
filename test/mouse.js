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
      clientX : e.clientX,
      clientY : e.clientY,
      altKey : e.altKey,
      ctrlKey : e.ctrlKey,
      shiftKey : e.shiftKey,
      metaKey : e.metaKey,
      button : e.button,
      buttons : e.buttons,
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
            assert.equal(evts[0].button, 0);
        });

        it("should set the view property to window", function() {
            assert.equal(evts[0].view, window);
        });

        it("should set the relatedTarget property to null", function() {
            assert.equal(evts[0].relatedTarget, null);
        });

        if(document.elementFromPoint&&document.body.getBoundingClientRect) {
          it("should return right coords", function() {
            assert.equal(
              document.elementFromPoint(evts[0].clientX, evts[0].clientY),
              elt
            );
          });
        }

        it("should set the buttons property to LEFT_BUTTON", function() {
            assert.equal(evts[0].buttons, mouse.LEFT_BUTTON);
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
              buttons : mouse.MIDDLE_BUTTON
            }), true);
        });

        it("should set the button property to 1", function() {
            assert.equal(evts[0].button, 1);
        });

        it("should set the buttons property to MIDDLE_BUTTON", function() {
            assert.equal(evts[0].buttons, mouse.MIDDLE_BUTTON);
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
              buttons : mouse.RIGHT_BUTTON
            }), true);
        });

        it("should set the button property to 2", function() {
            assert.equal(evts[0].button, 2);
        });

        it("should set the buttons property to RIGHT_BUTTON", function() {
            assert.equal(evts[0].buttons, mouse.RIGHT_BUTTON);
        });

    });

    describe("double clicking an element with the right button", function() {

        before(function() {
            init();
            regEventListener(elt, 'click');
            regEventListener(elt, 'mousedown');
            regEventListener(elt, 'mouseup');
            regEventListener(elt, 'dblclick');
            regEventListener(document.body, 'dblclick');
        });

        after(uninit);

        it("should return true", function() {
            assert.equal(mouse.dblclick(elt, {
              buttons : mouse.RIGHT_BUTTON
            }), true);
        });

        it("should set the button property to 2", function() {
            assert.equal(evts[0].button, 2);
        });

        it("should set the buttons property to RIGHT_BUTTON", function() {
            assert.equal(evts[0].buttons, mouse.RIGHT_BUTTON);
        });

        it("should trigger a mousedown event on the element", function() {
            assert.equal(evts[0].type, 'mousedown');
            assert.equal(evts[0].target, elt);
            assert.equal(evts[0].currentTarget, elt);
        });

        it("should trigger a mouseup event on the element", function() {
            assert.equal(evts[1].type, 'mouseup');
            assert.equal(evts[1].target, elt);
            assert.equal(evts[1].currentTarget, elt);
        });

        it("should trigger a click event on the element", function() {
            assert.equal(evts[2].type, 'click');
            assert.equal(evts[2].target, elt);
            assert.equal(evts[2].currentTarget, elt);
        });

        it("should trigger a mousedown event on the element", function() {
            assert.equal(evts[3].type, 'mousedown');
            assert.equal(evts[3].target, elt);
            assert.equal(evts[3].currentTarget, elt);
        });

        it("should trigger a mouseup event on the element", function() {
            assert.equal(evts[4].type, 'mouseup');
            assert.equal(evts[4].target, elt);
            assert.equal(evts[4].currentTarget, elt);
        });

        it("should trigger a click event on the element", function() {
            assert.equal(evts[5].type, 'click');
            assert.equal(evts[5].target, elt);
            assert.equal(evts[5].currentTarget, elt);
        });

        it("should trigger a dblclick event on the element", function() {
            assert.equal(evts[6].type, 'dblclick');
            assert.equal(evts[6].target, elt);
            assert.equal(evts[6].currentTarget, elt);
        });

        it("should bubble the dblclick event on the parent", function() {
            assert.equal(evts[7].type, 'dblclick');
            assert.equal(evts[7].target, elt);
            assert.equal(evts[7].currentTarget, document.body);
        });

    });

    describe("moving to an element", function() {

        before(function() {
            init('<p><span>Line 1</span></p><p><span>Line 2</span></p>'
              +'<p><span>Line 3</span></p><p><span>Line 4</span></p>');
            regEventListener(elt.firstChild.firstChild, 'mouseout');
            regEventListener(elt.lastChild.firstChild, 'mouseover');
            regEventListener(elt.lastChild.firstChild, 'mouseout');
        });

        after(uninit);

        it("should return true", function() {
            assert.equal(mouse.moveTo(elt.firstChild.firstChild), true);
            assert.equal(mouse.moveTo(elt.lastChild.firstChild), true);
        });

        it("should trigger a mouseout event on old under cursor element", function() {
            assert.equal(evts[0].type, 'mouseout');
            assert.equal(evts[0].target, elt.firstChild.firstChild);
            assert.equal(evts[0].currentTarget, elt.firstChild.firstChild);
        });

        it("should set the newly under cursor element", function() {
            assert.equal(evts[0].relatedTarget, elt.lastChild.firstChild);
        });

        it("should trigger a mouseover event on newly under cursor element", function() {
            assert.equal(evts[1].type, 'mouseover');
            assert.equal(evts[1].target, elt.lastChild.firstChild);
            assert.equal(evts[1].currentTarget, elt.lastChild.firstChild);
        });

        it("should set the newly  under cursor element", function() {
            assert.equal(evts[1].relatedTarget, elt.firstChild.firstChild);
        });

    });

    describe("scrolling to an element", function() {

        var type=('onwheel' in document ? 'wheel' :
          ('onmousewheel' in document ? 'mousewheel' : '')
         );

        if(!type) {
          return;
        }

        before(function() {
            init('<p style="height:10000px; width:1000px; background:#F00;">Block 1</p>'
              +'<p style="height:10000px; width:1000px; background:#0F0;">Block 2</p>'
              +'<p style="height:10000px; width:1000px; background:#00F;">Block 3</p>');
            regEventListener(elt.firstChild, type);
            regEventListener(elt.lastChild, type);
        });

        after(uninit);

        it("should return true if scrolled, false otherwise", function() {
          assert.equal(mouse.scrollTo(elt.lastChild),
            (25048>window.innerHeight ? true : false));
        });

        it("should trigger a wheel event on the first element", function() {
          if(25048>window.innerHeight) {
            assert.equal(evts[0].type, type);
            assert.equal(evts[0].target, elt.firstChild);
            assert.equal(evts[0].currentTarget, elt.firstChild);
          }
        });

    });

    describe("focusing an element", function() {

        before(function() {
            init('<p>Text</p><p><a href="#">A link</a></p>');
            regEventListener(elt.lastChild.firstChild, 'mouseover');
            regEventListener(elt.lastChild.firstChild, 'mouseout');
            regEventListener(elt.lastChild.firstChild, 'focus');
        });

        after(uninit);

        it("should return true", function() {
          assert.equal(mouse.focus(elt.lastChild.firstChild), true);
        });

        it("should set the link as the active element", function() {
          assert.equal(elt.lastChild.firstChild, document.activeElement);
        });

        it("should trigger a mouseover event on the focused element", function() {
          assert.equal(evts[0].type, 'mouseover');
          assert.equal(evts[0].target, elt.lastChild.firstChild);
          assert.equal(evts[0].currentTarget, elt.lastChild.firstChild);
        });

        it("should trigger a mouseout event on the focused element", function() {
          assert.equal(evts[1].type, 'mouseout');
          assert.equal(evts[1].target, elt.lastChild.firstChild);
          assert.equal(evts[1].currentTarget, elt.lastChild.firstChild);
        });

        it("should trigger a focus event on the focused element", function() {
          assert.equal(evts[2].type, 'focus');
          assert.equal(evts[2].target, elt.lastChild.firstChild);
          assert.equal(evts[2].currentTarget, elt.lastChild.firstChild);
        });

    });

});
