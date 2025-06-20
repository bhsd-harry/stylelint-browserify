/* eslint-env node */
'use strict';

const config = require('@bhsd/common/eslintrc.dist.cjs');

module.exports = {
	...config,
	env: {
		worker: true,
		es2019: true,
	},
	parserOptions: {
		...config.parserOptions,
		sourceType: 'module',
	},
	globals: {
		Buffer: 'readonly',
		globalThis: 'readonly',
		process: 'readonly',
		structuredClone: 'readonly',
		window: 'readonly',
	},
	rules: {
		...config.rules,
		'no-undef': 2,
		'es-x/no-array-prototype-at': 0,
		'es-x/no-string-prototype-at': 0,
	},
	overrides: [
		{
			files: ['stylelint-es*.js'],
			extends: [
				'plugin:es-x/no-new-in-es2018',
				'plugin:es-x/no-new-in-es2019',
				'plugin:es-x/no-new-in-es2020',
			],
			rules: {
				'es-x/no-global-this': 0,
			},
		},
	],
};
