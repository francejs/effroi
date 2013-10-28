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
            assert.equal(keyboard.hit('a'), true);
        });

        it("should set the char and charcode property", function() {
            assert.equal(evts[0].char, 'a');
            // Seems impossible to change charCode prop with phantom
            if(!navigator.userAgent.match(/phantom/i)) {
              assert.equal(evts[0].charCode, 'a'.charCodeAt(0));
            }
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
            assert.equal(keyboard.hit('a'), true);
        });

        it("should set the char property correctly", function() {
            assert.equal(evts[0].char, 'a');
        });

        it("should set the view property to window", function() {
            assert.equal(evts[0].view, window);
        });

        it("should change its value", function() {
            assert.equal(elt.firstChild.firstChild.lastChild.value, 'boooooooba');
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

    describe("combining ctrl + c", function() {

        before(function() {
            init();
            regEventListener(document.body, 'keydown');
            regEventListener(document.body, 'keypress');
            regEventListener(document.body, 'keyup');
            
        });

        after(uninit);

        it("should return true", function() {
            assert.equal(keyboard.combine(keyboard.CTRL, 'c'), true);
        });

        it("should set an empty char property for the CTRL keydown event", function() {
            assert.equal(evts[0].type, 'keydown');
            assert.equal(evts[0].char, '');
        });

        it("should set the ctrlKey property for the CTRL keydown event", function() {
            (!/phantom/i.test(navigator.userAgent)) &&
            assert.equal(evts[0].ctrlKey, true);
        });

        it("should set an empty char property for the c keydown event", function() {
            assert.equal(evts[1].type, 'keydown');
            assert.equal(evts[1].char, 'c');
        });

        it("should set the ctrlKey property for the c keydown event", function() {
            (!/phantom/i.test(navigator.userAgent)) &&
            assert.equal(evts[1].ctrlKey, true);
        });

        it("should set an empty char property for the CTRL keyup event", function() {
            assert.equal(evts[2].type, 'keyup');
            assert.equal(evts[2].char, '');
        });

        it("should set the ctrlKey property for the CTRL keyup event", function() {
            (!/phantom/i.test(navigator.userAgent)) &&
            assert.equal(evts[2].ctrlKey, false);
        });

        it("should set the char property to 'c' for the c keyup event", function() {
            assert.equal(evts[3].type, 'keyup');
            assert.equal(evts[3].char, 'c');
        })

        it("should set the ctrlKey property for the c keyup event", function() {
            (!/phantom/i.test(navigator.userAgent)) &&
            assert.equal(evts[3].ctrlKey, false);
        });

    });

    describe("pasting inside an input[type=text] element where some text is selected", function() {

        before(function() {
            init('<p><label>Text: <input type="text" value="booooooob" /></label></p>');
            elt.firstChild.firstChild.lastChild.focus();
            elt.firstChild.firstChild.lastChild.selectionStart=1;
            elt.firstChild.firstChild.lastChild.selectionEnd=8;
        });

        after(uninit);

        it("should return true", function() {
          assert.equal(keyboard.paste('00'), true);
        });

        it("should change it's value", function() {
          assert.equal(elt.firstChild.firstChild.lastChild.value,'b00b');
        });

    });

    describe("pasting inside an input[type=text] element where some text is selected and the keydown event prevented", function() {

        before(function() {
            init('<p><label>Text: <input type="text" value="booooooob" /></label></p>');
            elt.firstChild.firstChild.lastChild.focus();
            elt.firstChild.firstChild.lastChild.selectionStart=1;
            elt.firstChild.firstChild.lastChild.selectionEnd=8;
            regEventListener(elt.firstChild.firstChild.lastChild,
              'keydown', false, false, true);
        });

        after(uninit);

        it("should return false", function() {
          assert.equal(
            keyboard.paste('00'),
            false);
        });

        it("should not change it's value", function() {
          assert.equal(elt.firstChild.firstChild.lastChild.value,'booooooob');
        });

    });

    describe("cutting the selected text inside an input[type=text]", function() {

        before(function() {
            init('<p><label>Text: <input type="text" value="booooooob" /></label></p>');
            elt.firstChild.firstChild.lastChild.focus();
            elt.firstChild.firstChild.lastChild.selectionStart=1;
            elt.firstChild.firstChild.lastChild.selectionEnd=8;
        });

        after(uninit);

        it("should return the cutted content", function() {
          assert.equal(keyboard.cut(),'ooooooo');
        });

        it("should change it's value", function() {
          assert.equal(elt.firstChild.firstChild.lastChild.value,'bb');
        });

    });

    describe("cutting the selected text inside an input[type=text] with a keydown event prevented", function() {

        before(function() {
            init('<p><label>Text: <input type="text" value="booooooob" /></label></p>');
            elt.firstChild.firstChild.lastChild.focus();
            elt.firstChild.firstChild.lastChild.selectionStart=1;
            elt.firstChild.firstChild.lastChild.selectionEnd=8;
            regEventListener(elt.firstChild.firstChild.lastChild,
              'keydown', false, false, true);
        });

        after(uninit);

        it("should return no content", function() {
          assert.equal(keyboard.cut(),'');
        });

        it("should not change it's value", function() {
          assert.equal(elt.firstChild.firstChild.lastChild.value,'booooooob');
        });

    });

    describe("focusing elements with the keyboard", function() {

        var previousActiveElement;

        before(function() {
            init(
                '<p>'
              + '<label>Text: <input type="text" value="text" /></label>'
              + '<label>Number: <input type="number" value="1664" /></label>'
              + '<label>Textarea: <textarea>Plop</textarea</label>'
              + '<label>Date: <input type="date" value="" /></label>'
              + '<label>Link: <a href="#">Link</a></label>'
              + '<label>Button: <button label="Button"/></label>'
              + '<label>Submit: <input type="submit" value="submit" /></label>'
              + '</p>'
            );
            regEventListener(document, 'keydown');
            regEventListener(document, 'keyup');
            regEventListener(elt.firstChild.firstChild.lastChild, 'blur');
            regEventListener(elt.firstChild.firstChild.lastChild, 'focus');
        });

        after(uninit);

        it("should return true", function() {
          previousActiveElement = document.activeElement;
          regEventListener(previousActiveElement, 'blur');
          regEventListener(previousActiveElement, 'focus');
          assert.equal(keyboard.focus(elt.firstChild.firstChild.lastChild), true);
        });

        it("should set the element as the active element", function() {
          assert.equal(elt.firstChild.firstChild.lastChild, document.activeElement);
        });

        it("should trigger a keydown event on the previousActiveElement", function() {
            assert.equal(evts[0].type, 'keydown');
            assert.equal(evts[0].target, previousActiveElement);
            // Seems impossible to change charCode prop with phantom
            if(!navigator.userAgent.match(/phantom/i)) {
              assert.equal(evts[0].charCode,
                keyboard.KEY_TO_CHARCODE[keyboard.TAB]);
            }
        });

        it("should trigger a blur event on the previousActiveElement", function() {
            assert.equal(evts[1].type, 'blur');
            assert.equal(evts[1].target, previousActiveElement);
            // Sadly, it seems impossible to set relatedTarget while using
            // the focus/blur methods. Maybe do a select() and fire focus evts
            // manually could do the job ?
            // assert.equal(evts[1].relatedTarget, elt.firstChild.firstChild.lastChild);
        });

        it("should trigger a focus event on the newly activeElement", function() {
            assert.equal(evts[2].type, 'focus');
            assert.equal(evts[2].target, elt.firstChild.firstChild.lastChild);
            // Sadly, it seems impossible to set relatedTarget while using
            // the focus/blur methods. Maybe do a select() and fire focus evts
            // manually could do the job ?
            // assert.equal(evts[2].relatedTarget, previousActiveElement);
        });

        it("should trigger a keyup event on the newlyActiveElement", function() {
            assert.equal(evts[3].type, 'keyup');
            assert.equal(evts[3].target, elt.firstChild.firstChild.lastChild);
            // Seems impossible to change charCode prop with phantom
            if(!navigator.userAgent.match(/phantom/i)) {
              assert.equal(evts[3].charCode,
                keyboard.KEY_TO_CHARCODE[keyboard.TAB]);
            }
        });

    });

});
