const { isMatched, looksForVariableDeclarator } = require('../lib/utils');
const disabledExpressionStatements = {
	concat: true,
	map: true,
	find: true,
	findIndex: true,
	filter: { isNodeOk: verifyFilterNode },
	reduce: true,
	some: true,
	every: true,
	reduceRight: true,
	from: true,
};

module.exports = {
	schema: [],
	create: function(context) {
		return {
			ExpressionStatement: function(node) {
				const expression = node.expression || {};
				if (
					!isMatched(expression, {
						type: 'CallExpression',
						callee: { type: 'MemberExpression' },
					})
				) {
					return;
				}
				const propertyName = expression.callee.property.name;
				if (!disabledExpressionStatements.hasOwnProperty(propertyName)) {
					return;
				}
				const type = disabledExpressionStatements[propertyName];
				if (!type) {
					return;
				}

				if (typeof type === 'object' && typeof type.isNodeOk === 'function') {
					if (type.isNodeOk(node, context)) {
						return;
					}
				}
				let message = `${propertyName} shouldn't mutate so you should care about the return value!`;
				return context.report({ node, message });
			},
		};
	},
};

/**
 * We want to consider angular.module(..).filter as being ok. Anything else does not
 * follow our single responsibility so can be ignored
 */
function verifyFilterNode(node, context) {
	const callee = node.expression.callee; // e.g. angular.module(..)
	if (!isMatched(callee, { object: { type: 'CallExpression' } })) {
		return true;
	}
	const rootCallee = looksForRootMemberExpression(callee);
	if (rootCallee.type === 'MemberExpression') {
		if (isAngularModule(rootCallee)) {
			return true;
		}
		const variableDeclarator = looksForVariableDeclarator(
			rootCallee.object,
			context
		);
		if (
			!isMatched(variableDeclarator, {
				init: { type: 'CallExpression', callee: { type: 'MemberExpression' } },
			})
		) {
			return false;
		}
		const memberExpression = variableDeclarator.init.callee;
		return isAngularModule(memberExpression);
	}

	return false;
}

function isAngularModule(node) {
	return isMatched(node, {
		type: 'MemberExpression',
		object: { name: 'angular' },
		property: { name: 'module' },
	});
}



function looksForRootMemberExpression(callee) {
	while (isMatched(callee, { object: { type: 'CallExpression' } })) {
		callee = callee.object.callee;
	}
	return callee;
}
