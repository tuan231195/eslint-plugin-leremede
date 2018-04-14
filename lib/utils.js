exports.isMatched = isMatched;
exports.looksForVariableDeclarator = looksForVariableDeclarator;

function isMatched(a, b) {
	if (typeof b !== 'function') {
		if (typeof b !== 'object') {
			return a === b;
		} else {
			return (
				a && b && Object.keys(b).every(bKey => isMatched(a[bKey], b[bKey]))
			);
		}
	}
	return b(a);
}

function looksForVariableDeclarator(identifier, context) {
	const variable = context
		.getScope()
		.variables.find(variable => variable.name === identifier.name);
	if (variable) {
		const reference = variable.references.find(reference =>
			isMatched(reference, {
				identifier: { parent: { type: 'VariableDeclarator' } },
			})
		);
		if (reference) {
			return reference.identifier.parent;
		}
	}
	return null;
}
