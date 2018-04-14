const rule = require('../../rules/use-pascal-case-for-instantiated-objects');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester();
ruleTester.run('use-pascal-case-for-instantiated-objects', rule, {
	valid: [
		{
			code: `
			var test = new MyService();
		`,
		},
	],
	invalid: [
		{
			code: `
			var test = new myService();
		`,
			errors: [
				{
					ruleId: 'use-pascal-case-for-instantiated-objects',
					message: `Should use pascal cases (e.g. MyService) for instantiated objects`,
				},
			],
		},
	],
});
