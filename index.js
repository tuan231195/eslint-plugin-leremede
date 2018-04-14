module.exports = {
	rules: {
		'disable-meaningless-expression-statements': require('./rules/disable-meaningless-expression-statements'),
		'same-controller-and-controller-as': require('./rules/same-controller-and-controller-as'),
		'prevent-event-stop-propagation': require('./rules/prevent-event-stop-propagation'),
		'use-pascal-case-for-instantiated-objects': require('./rules/use-pascal-case-for-instantiated-objects'),
	},
};
