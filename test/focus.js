var focus = effroi.focus,
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
      charCode : e.charCode,
      char : e.char,
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

describe("UI focus", function() {

    describe("set to an element when another element is focused", function() {

        var previousActiveElement;

        before(function() {
            init(
                '<p>'
              + '<label>Text: <input type="text" value="text" name="text1" /></label>'
              + '<label>Text: <input type="text" value="text" name="text2" /></label>'
              + '</p>'
            );
            elt.firstChild.firstChild.lastChild.focus();
            regEventListener(elt.firstChild.firstChild.lastChild, 'blur');
            regEventListener(elt.firstChild.firstChild.lastChild, 'focusout');
            regEventListener(elt.firstChild.lastChild.lastChild, 'focus');
            regEventListener(elt.firstChild.lastChild.lastChild, 'focusin');
            regEventListener(document.body, 'focusout');
            regEventListener(document.body, 'focusin');
        });

        after(uninit);

        it("should return true", function() {
          assert.equal(focus.focus(elt.firstChild.lastChild.lastChild), true);
        });

        it("should set the element as the active element", function() {
          assert.equal(elt.firstChild.lastChild.lastChild, document.activeElement);
        });

        it("should trigger a blur event on the previously focused element", function() {
            assert.equal(evts[0].type, 'blur');
            assert.equal(evts[0].target, elt.firstChild.firstChild.lastChild);
        });

        it("should not bubble the blur event on the element parents", function() {
            assert.notEqual(evts[1].type, 'blur');
        });

        it("should trigger a focusout event on the previously focused element", function() {
            assert.equal(evts[1].type, 'focusout');
            assert.equal(evts[1].target, elt.firstChild.firstChild.lastChild);
        });

        it("should bubble the focusout event to element parents", function() {
            assert.equal(evts[2].type, 'focusout');
            assert.equal(evts[2].target, elt.firstChild.firstChild.lastChild);
        });

        it("should trigger a focus event on the newly focused element", function() {
            assert.equal(evts[3].type, 'focus');
            assert.equal(evts[3].target, elt.firstChild.lastChild.lastChild);
        });

        it("should not bubble the focus event on the element parents", function() {
            assert.notEqual(evts[4].type, 'focus');
        });

        it("should trigger a focusin event on the previously focused element", function() {
            assert.equal(evts[4].type, 'focusin');
            assert.equal(evts[4].target, elt.firstChild.lastChild.lastChild);
        });

        it("should bubble the focusin event to element parents", function() {
            assert.equal(evts[5].type, 'focusin');
            assert.equal(evts[5].target, elt.firstChild.lastChild.lastChild);
        });

    });

});
