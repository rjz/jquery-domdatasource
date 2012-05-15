(function () {

  "use strict";

module('unit/plugin');

var tests = {

    '#test-element': {
        type: 'element',
        attributes: { foo: '' },
        expected : { foo: 'bar' }
    },

    '#test-children': {
        type: 'children',
        attributes: { color: '', make: '', model: '' },
        expected: { color: 'yellow', make: 'dodge', model: 'dart' }
    },

    '#test-list': {
        type: 'list',
        attributes: { color: '', make: '', model: '' },
        expected: [
            { color: 'blue', make: 'amc', model: 'hornet' },
            { color: 'orange', make: 'chevrolet', model: 'corvair' }
        ]
    },

    '#test-table': {
        type: 'table',
        attributes: { color: '', make: '', model: '' },
        expected: [
            { color: 'green', make: 'oldsmobile', model: 'woodie' },
            { color: 'silver', make: 'dmc', model: 'delorean' }
        ]
    }
};

test('retrieving data', function () {

    // test to make sure the correct data is being pulled
    // from each data container:

    $.each(tests, function (selector, test) {

        var $el = $(selector),
            hash = $el.DOMDataSource(test.attributes, { type: test.type });

        deepEqual(test.expected, hash);
    });
});

test('type.auto', function () {

    // expect a DOMDataSource drawn from each test element to
    // return the same results as if the type had been explicitly
    // specified:

    $.each(tests, function (selector, test) {

        var $el = $(selector),
            result;

        if (test.type != 'element') {
            result = $el.DOMDataSource(test.attributes);
            deepEqual(test.expected, result); 
        }
    });
});

})();
