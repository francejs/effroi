describe("Mouse device", function() {
    var mouse = effroi.mouse,
        assert = chai.assert;

    describe("click", function() {
		    var elt;
        before(function() {
             elt = document.createElement('div');
            elt.innerHTML = 'foo';
            document.body.appendChild(elt);
            elt.addEventListener('click', function(e) {
                this.className = 'clicked';
            }, false);
        });

        after(function() {
            document.body.removeChild(elt);
        });

        it("should trigger a click event on the element", function() {
            mouse.click(elt);
            assert(elt.className == 'clicked');
        });
    });
});
