describe("Element DSL", function() {
    var assert = chai.assert,
        element = effroi.element;

    describe("element()", function() {
        beforeEach(function() {
            var elt = document.createElement('div');
            elt.id = 'foo';
            elt.innerHTML = 'test';
            document.body.appendChild(elt);
        });

        afterEach(function() {
            document.body.removeChild(document.getElementById('foo'));
        });

        it("should return an object", function() {
            assert(typeof element('#foo') == 'object');
        });

        it("should throw if the provided selector doesn't match any element", function() {
            assert.throw(function() { element('#bar'); }, Error);
        });

        describe("isVisible()", function() {
            it("should return true if the element is visible", function() {
                assert.ok(element('#foo').isVisible());
            });

            it("should return false if the element's visibility is set to hidden", function() {
                document.getElementById('foo').setAttribute('style', 'visibility: hidden');
                assert.notOk(element('#foo').isVisible());
            });
        });
    });
});
