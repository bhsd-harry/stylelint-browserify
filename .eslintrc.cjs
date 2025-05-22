'use strict';

const config = require('@bhsd/common/eslintrc.node.cjs');

module.exports = {
	...config,
	overrides: [
		...config.overrides,
		{
			files: ['**/*.mjs'],
			parserOptions: {
				sourceType: 'module',
			},
		},
		{
			files: ['index-es7.mjs'],
			env: {
				worker: true,
			},
			rules: {
				'unicorn/prefer-global-this': 0,
			},
		},
	],
};
