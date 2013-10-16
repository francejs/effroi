describe("Mouse device", function() {
    var mouse = effroi.mouse,
        assert = chai.assert;

    describe("click", function() {
        before(function() {
            var elt = document.createElement('div');
            elt.id = 'clickable';
            elt.innerHTML = 'foo';
            document.body.appendChild(elt);
            elt.addEventListener('click', function(e) {
                this.className = 'clicked';
            }, false);
        });

        after(function() {
            document.body.removeChild(document.getElementById('clickable'));
        });

        it("should trigger a click event on the element", function() {
            mouse.click('#clickable');
            assert(document.getElementById('clickable').className == 'clicked');
        });
    });
});