const rule = require('../../rules/prevent-event-stop-propagation');
const RuleTester = require('eslint').RuleTester;

const errors = [
	{
		ruleId: 'prevent-event-stop-propagation',
		message: `event.stopPropagation should be avoided`,
	},
];

const ruleTester = new RuleTester();
ruleTester.run('prevent-event-stop-propagation', rule, {
	valid: [],
	invalid: [
		{
			code: `event.stopPropagation()`,
			errors,
		},
		{
			code: `e.stopPropagation()`,
			errors,
		},
	],
});
