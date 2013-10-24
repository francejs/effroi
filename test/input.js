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

    var textInputs = [
        { 
            type: "input[type='text']",
            html: '<input type="text" name="bar" value="hello">'
        },
        { 
            type: "input[type='password']",
            html: '<input type="password" name="bar" value="hello">'
        },
        { 
            type: "textarea",
            html: '<textarea name="bar">hello</textarea>'
        }
    ];

    textInputs.forEach(function(textInput) {
        describe("input() with an "+textInput.type, function() {
            beforeEach(function() {
                createElement(textInput.html);
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

            describe("fill()", function() {
                it("can paste the input value", function() {
                    input('[name="bar"]').fill('salut', 'paste');
                    assert.equal('salut', document.querySelector('[name="bar"]').value);
                });
            });
        });
    });
});