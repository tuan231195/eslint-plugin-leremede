module.exports = {
	schema: [],
	create: function(context) {
		return {
			ObjectExpression: function(node) {
				const controllerProperty = getProperty(node, 'controller');
				const controllerAsProperty = getProperty(node, 'controllerAs');
				let controllerAsValue, controllerValue;
				if (controllerAsProperty && isLiteralProperty(controllerAsProperty)) {
					controllerAsValue = controllerAsProperty.value.value;
					if (!controllerAsValue) {
						return;
					}
					if (!isNameEndingInController(controllerAsValue)) {
						context.report({
							node: controllerAsProperty,
							message: "controllerAs should end in 'Controller'",
						});
					}
				}

				if (controllerProperty && isIdentifierProperty(controllerProperty)) {
					controllerValue = controllerProperty.value.name;
					if (!controllerValue) {
						return;
					}
					if (!isNameEndingInController(controllerValue)) {
						context.report({
							node: controllerProperty,
							message: "controller should end in 'Controller'",
						});
					}
				}

				if (controllerValue && controllerAsValue) {
					if (controllerValue !== controllerAsValue) {
						context.report({
							node: node,
							message: 'controller and controllerAs naming should be the same.',
						});
					}
				}
			},
		};
	},
};

function getProperty(node, name) {
	return (node.properties || []).find(property => {
		return property.key.name === name;
	});
}

function isLiteralProperty(property) {
	return property.value.type === 'Literal';
}

function isIdentifierProperty(property) {
	return property.value.type === 'Identifier';
}

function isNameEndingInController(name) {
	return name.endsWith('Controller');
}
