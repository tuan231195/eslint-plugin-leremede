const rule = require('../../rules/same-controller-and-controller-as');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester();
ruleTester.run('same-controller-and-controller-as', rule, {
	valid: [
		{
			code: `
			function MyController(){}
			angular.module('some-module').component('someComponent', {
				controller: MyController,
				controllerAs: 'MyController'
			});
		`,
		},
		{
			code: `
			function MyController(){}
			angular.module('some-module').component('someComponent', {
				controller: MyController,
			});
		`,
		},
		{
			code: `
			function MyController(){}
			angular.module('some-module').directive('someDirective', function(){
				return {
					controller: MyController,
					controllerAs: 'MyController'
				};
			});
		`,
		},
	],
	invalid: [
		{
			code: `
			function MyController(){}
			angular.module('some-module').component('someComponent', {
				controller: MyController,
				controllerAs: 'MyCtrl'
			});
		`,
			errors: [
				{
					message: `controller and controllerAs naming should be the same.`,
				},
				{
					message: `controllerAs should end in 'Controller'`,
				},
			],
		},
		{
			code: `
			var MyCtrl = function (){};
			angular.module('some-module').component('someComponent', {
				controller: MyCtrl,
				controllerAs: 'MyCtrl'
			});
		`,
			errors: [
				{
					message: `controller should end in 'Controller'`,
				},
				{
					message: `controllerAs should end in 'Controller'`,
				},
			],
		},
		{
			code: `
			var testingCtrl = function (){};
			angular.module('some-module').directive('someDirective', function(){
				return {
					controller: testingCtrl,
					controllerAs: 'testCtrl'
				};
			});
		`,
			errors: [
				{
					message: `controller and controllerAs naming should be the same.`,
				},
				{
					message: `controller should end in 'Controller'`,
				},
				{
					message: `controllerAs should end in 'Controller'`,
				},
			],
		},
	],
});
