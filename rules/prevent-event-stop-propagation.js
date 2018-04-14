'use strict';

module.exports = {
	create: function(context) {
		return {
			CallExpression: function(callExpression) {
				let callee = callExpression.callee;
				if (
					!isNodeType(callee, 'MemberExpression') ||
					!isNodeType(callee.property, 'Identifier') ||
					callee.property.name !== 'stopPropagation'
				) {
					return;
				}
				let message = 'event.stopPropagation should be avoided';
				return context.report({ node: callee.property, message });
			},
		};
	},
};

function isNodeType(node, type) {
	return node && node.type === type;
}
