'use strict';
var assert = require('assert');
var rocambole = require('rocambole');
var keshiGum = require('./');

function strip(str) {
    return rocambole.moonwalk(str, function (node) {
        keshiGum(node);
    }).toString();
}

it('should not strip console.log statement', function () {
    assert.equal(strip('function test(){console.log("foo");}'), 'function test(){console.log("foo");}');
    assert.equal(strip('function test(){window.console.log("foo");}'), 'function test(){window.console.log("foo");}');
    assert.equal(strip('"use strict";console.log("foo");foo()'), '"use strict";console.log("foo");foo()');
    assert.equal(strip('if(console){console.log("foo", "bar");}'), 'if(console){console.log("foo", "bar");}');
    assert.equal(strip('foo && console.log("foo");'), 'foo && console.log("foo");');
    assert.equal(strip('if (foo) console.log("foo")\nnextLine();'), 'if (foo) console.log("foo")\nnextLine();');
});

it('should strip console.time statement', function () {
    assert.equal(strip('function test(){console.time("foo");}'), 'function test(){void 0;}');
    assert.equal(strip('function test(){window.console.time("foo");}'), 'function test(){void 0;}');
    assert.equal(strip('"use strict";console.time("foo");foo()'), '"use strict";void 0;foo()');
    assert.equal(strip('if(console){console.time("foo", "bar");}'), 'if(console){void 0;}');
    assert.equal(strip('foo && console.time("foo");'), 'foo && void 0;');
    assert.equal(strip('if (foo) console.time("foo")\nnextLine();'), 'if (foo) void 0\nnextLine();');
});

it('should never strip away non-debugging code', function () {
    var t = 'var test = {\n    getReadSections: function(){\n        var readSections = window.localStorage.getItem(\'storyReadSections\') || \'[]\';\n        return JSON.parse(readSections);\n    }\n};';
    assert.equal(strip(t), t);
});