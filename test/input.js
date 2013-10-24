describe("Input DSL", function() {
    function createElement(html) {
        var elt = document.createElement('div');
        elt.id = 'foo';
        elt.innerHTML = html;
        document.body.appendChild(elt);
    }

    var assert = chai.assert,
        input = effroi.input;

    afterEach(function() {
        document.body.removeChild(document.getElementById('foo'));
    });

    describe("input() with an input[type='text']", function() {
        beforeEach(function() {
            createElement('<input type="text" name="bar" value="hello">');
        });

        describe("val()", function() {
            it("should return the input value", function() {
                assert.equal('hello', input('[name="bar"]').val());
            });
        });

        describe("set()", function() {
            it("should set the input value", function() {
                input('[name="bar"]').set('salut');
                assert.equal('salut', document.querySelector('[name="bar"]').value);
            });
        });
    });
});