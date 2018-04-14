'use strict';

var rule = require('../../rules/disable-meaningless-expression-statements');
var RuleTester = require('eslint').RuleTester;

var ruleTester = new RuleTester();
ruleTester.run('disable-meaningless-expression-statements', rule, {
	valid: [
		// we shouldnt care for prototypes on the meaningless statements object
		{
			code: `something.__defineGetter__()`,
		},
		// Passing into a function should be valid
		{
			code: `
			const test = anArray => doSomething(anArray);
			test(oldArray.concat(otherArray));
		`,
			parserOptions: { ecmaVersion: 6 },
		},
		// angular filters are ok
		{
			code: `angular.module('name').filter(function(){});`,
			parserOptions: { ecmaVersion: 5 },
		},
		{
			code: `angular.module('name')
					.controller('controller1', function(){})
					.controller('controller2', function(){})
					.filter(function(){});`,
			parserOptions: { ecmaVersion: 5 },
		},
		{
			code: `module.filter();`,
			parserOptions: { ecmaVersion: 5 },
		},
		{
			code: ` const module = angular.module('name', []);
				module
					.controller('controller1', function(){})
					.controller('controller2', function(){})
					.filter(function(){});`,
			parserOptions: { ecmaVersion: 6 },
		},
		// variable declaration with concat
		{
			code: 'var newArray = oldArray.concat(otherArray);',
			parserOptions: { ecmaVersion: 5 },
		},
		{
			code: 'var newArray = object.oldArray.concat(otherArray);',
			parserOptions: { ecmaVersion: 5 },
		},
		{
			code: 'let newArray = oldArray.concat(otherArray);',
			parserOptions: { ecmaVersion: 6 },
		},
		{
			code: 'const newArray = oldArray.concat(otherArray);',
			parserOptions: { ecmaVersion: 6 },
		},

		// variable assign with concat
		{
			code: 'newArray = object.oldArray.concat(otherArray);',
			parserOptions: { ecmaVersion: 5 },
		},
		{
			code: 'newArray = oldArray.concat(otherArray);',
			parserOptions: { ecmaVersion: 5 },
		},

		// variable return with concat
		{
			code: `
		function func() {
			return oldArray.concat(otherArray);
		}`,
			parserOptions: { ecmaVersion: 5 },
		},
		{
			code: `
		function func() {
			return object.oldArray.concat(otherArray);
		}`,
			parserOptions: { ecmaVersion: 5 },
		},
	],
	invalid: [
		{
			code: 'oldArray.concat(otherArray);',
			errors: [
				{
					message: `concat shouldn't mutate so you should care about the return value!`,
				},
			],
			parserOptions: { ecmaVersion: 5 },
		},
		{
			code: 'object.oldArray.concat(otherArray);',
			errors: [
				{
					message: `concat shouldn't mutate so you should care about the return value!`,
				},
			],
			parserOptions: { ecmaVersion: 5 },
		},
		{
			code: ` 
				const a = something;
				a.test().filter();
		`,
			errors: [
				{
					message: `filter shouldn't mutate so you should care about the return value!`,
				},
			],
			parserOptions: { ecmaVersion: 6 },
		},
		{
			code: 'a.test().filter()',
			errors: [
				{
					message: `filter shouldn't mutate so you should care about the return value!`,
				},
			],
			parserOptions: { ecmaVersion: 5 },
		},
	],
});
