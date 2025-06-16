'use strict';

const config = require('@bhsd/common/eslintrc.node.cjs');

module.exports = {
	...config,
	ignorePatterns: [
		'build/',
		'bundle/',
	],
	overrides: [
		...config.overrides,
		{
			files: ['**/*.mjs'],
			parserOptions: {
				sourceType: 'module',
			},
		},
		{
			files: ['index-*.mjs'],
			env: {
				worker: true,
			},
			rules: {
				'unicorn/prefer-global-this': 0,
			},
		},
	],
};
