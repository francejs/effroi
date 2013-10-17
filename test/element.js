describe("Element DSL", function() {
    var assert = chai.assert,
        element = effroi.element;

    describe("element()", function() {
        before(function() {
            var elt = document.createElement('div');
            elt.id = 'foo';
            document.body.appendChild(elt);
        });

        after(function() {
            document.body.removeChild(document.getElementById('foo'));
        });

        it("should return an object", function() {
            assert(typeof element('#foo') == 'object');
        });

        it("should throw if the provided selector doesn't match any element", function() {
            assert.throw(function() { element('#bar'); }, Error);
        });
    });
});