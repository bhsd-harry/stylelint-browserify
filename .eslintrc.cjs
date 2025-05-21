'use strict';

const config = require('@bhsd/common/eslintrc.node.cjs');

module.exports = {
	...config,
	rules: {
		'jsdoc/require-description': 0,
	},
	overrides: [
		...config.overrides,
		{
			files: ['**/*.mjs'],
			parserOptions: {
				sourceType: 'module',
			},
		},
		{
			files: ['index*.mjs'],
			env: {
				worker: true,
			},
		},
	],
};
