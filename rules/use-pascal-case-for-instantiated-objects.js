module.exports = {
	schema: [],
	create: function(context) {
		return {
			VariableDeclarator: node => {
				if (node.init && node.init.type === 'NewExpression') {
					const callee = node.init.callee;
					if (callee && callee.type === 'Identifier') {
						const name = callee.name;
						if (name.length && name[0] !== name[0].toUpperCase()) {
							const validName = name[0].toUpperCase() + name.slice(1);
							context.report({
								node: callee,
								message: `Should use pascal cases (e.g. ${validName}) for instantiated objects`,
							});
						}
					}
				}
			},
		};
	},
};
