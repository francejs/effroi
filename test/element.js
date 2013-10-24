describe("Element DSL", function() {
    var assert = chai.assert,
        element = effroi.element,
        mouse = effroi.mouse;

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

        describe("click()", function() {
            before(function() {
                sinon.spy(mouse, 'click');
            });

            after(function() {
                mouse.click.restore();
            });

            it("should call mouse.click() with an element", function() {
                element('#foo').click();
                assert(mouse.click.calledOnce);
                assert(mouse.click.args[0][0] instanceof Element);
            });
        });

        describe("dblclick()", function() {
            before(function() {
                sinon.spy(mouse, 'dblclick');
            });

            after(function() {
                mouse.dblclick.restore();
            });

            it("should call mouse.dblclick() with an element", function() {
                element('#foo').dblclick();
                assert(mouse.dblclick.calledOnce);
                assert(mouse.dblclick.args[0][0] instanceof Element);
            });
        });
    });
});
