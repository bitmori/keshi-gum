'use strict';
var updateNode = require('rocambole-node-update');

module.exports = function (node) {
    if (node.type !== 'CallExpression') {
        return;
    }

    var expression = node.callee;

    if (expression && expression.type !== 'MemberExpression') {
        return;
    }

    var main = expression.object;
    if (main && main.parent && main.parent.property && main.parent.property.name === 'time'){
        if ((main.type === 'MemberExpression' && main.object && main.object.type === 'Identifier' && main.object.name === 'window'
        && main.property && main.property.type === 'Identifier' && main.property.name === 'console'
        ) || (main.type === 'Identifier' && main.parent.object && main.parent.object.type === 'Identifier' && main.parent.object.name === 'console')) {
            // [window.]console.time
            updateNode(node, 'void 0');
        }
    }
};