var keyboard = effroi.keyboard,
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

describe("Keyboard device", function() {

    describe("hit a key when on an element", function() {

        before(function() {
            init();
            regEventListener(document.activeElement, 'keydown');
            regEventListener(document.activeElement, 'keypress');
            regEventListener(document.activeElement, 'keyup');
            
        });

        after(uninit);

        it("should return true", function() {
            assert.equal(keyboard.hit('a'.charCodeAt(0)), true);
        });

        it("should set the char and charcode property", function() {
            assert.equal(evts[0].char, 'a');
        });

        it("should set the view property to window", function() {
            assert.equal(evts[0].view, window);
        });

        it("should set the special key property to false", function() {
            assert.equal(evts[0].ctrlKey, false);
            assert.equal(evts[0].altKey, false);
            assert.equal(evts[0].shiftKey, false);
            assert.equal(evts[0].metaKey, false);
        });

        it("should trigger a keydown event on the activeElement", function() {
            assert.equal(evts[0].type, 'keydown');
            assert.equal(evts[0].target, document.activeElement);
        });

        it("should trigger a keypress event on the element", function() {
            assert.equal(evts[1].type, 'keypress');
            assert.equal(evts[1].target, document.activeElement);
        });

        it("should trigger a keyup event on the element", function() {
            assert.equal(evts[2].type, 'keyup');
            assert.equal(evts[2].target, document.activeElement);
        });

    });

    describe("hit a key when on an input element", function() {

        before(function() {
            init('<p><label>Text: <input type="text" value="booooooob" /></label></p>');
            elt.firstChild.firstChild.lastChild.focus();
            regEventListener(elt.firstChild.firstChild.lastChild, 'keydown');
            regEventListener(elt.firstChild.firstChild.lastChild, 'keypress');
            regEventListener(elt.firstChild.firstChild.lastChild, 'keyup');
            regEventListener(document.body, 'keydown');
            regEventListener(document.body, 'keypress');
            regEventListener(document.body, 'keyup');
            
        });

        after(uninit);

        it("should return true", function() {
            assert.equal(keyboard.hit('a'.charCodeAt(0)), true);
        });

        it("should set the char property correctly", function() {
            assert.equal(evts[0].char, 'a');
        });

        it("should set the view property to window", function() {
            assert.equal(evts[0].view, window);
        });

        it("should set the special key property to false", function() {
            assert.equal(evts[0].ctrlKey, false);
            assert.equal(evts[0].altKey, false);
            assert.equal(evts[0].shiftKey, false);
            assert.equal(evts[0].metaKey, false);
        });

        it("should trigger a keydown event on the activeElement", function() {
            assert.equal(evts[0].type, 'keydown');
            assert.equal(evts[0].target, elt.firstChild.firstChild.lastChild);
            assert.equal(evts[0].currentTarget, elt.firstChild.firstChild.lastChild);
        });

        it("should bubble the keydown event on the parent", function() {
            assert.equal(evts[1].type, 'keydown');
            assert.equal(evts[1].target, elt.firstChild.firstChild.lastChild);
            assert.equal(evts[1].currentTarget, document.body);
        });

        it("should trigger a keypress event on the element", function() {
            assert.equal(evts[2].type, 'keypress');
            assert.equal(evts[2].target, elt.firstChild.firstChild.lastChild);
            assert.equal(evts[2].currentTarget, elt.firstChild.firstChild.lastChild);
        });

        it("should bubble the keypress event on the parent", function() {
            assert.equal(evts[3].type, 'keypress');
            assert.equal(evts[3].target, elt.firstChild.firstChild.lastChild);
            assert.equal(evts[3].currentTarget, document.body);
        });

        it("should trigger a keyup event on the element", function() {
            assert.equal(evts[4].type, 'keyup');
            assert.equal(evts[4].target, elt.firstChild.firstChild.lastChild);
            assert.equal(evts[4].currentTarget, elt.firstChild.firstChild.lastChild);
        });

        it("should bubble the keyup event on the parent", function() {
            assert.equal(evts[5].type, 'keyup');
            assert.equal(evts[5].target, elt.firstChild.firstChild.lastChild);
            assert.equal(evts[5].currentTarget, document.body);
        });

    });

});
