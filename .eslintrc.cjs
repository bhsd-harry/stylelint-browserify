'use strict';

const config = require('@bhsd/code-standard/eslintrc.node.cjs');

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
		{
			files: ['test/**/*.mjs'],
			env: {
				mocha: true,
			},
			globals: {
				expect: 'readonly',
				filename: 'readonly',
				stylelint: 'readonly',
				testRule: 'readonly',
				testRuleConfigs: 'readonly',
			},
			rules: {
				'no-irregular-whitespace': 0,
				'no-template-curly-in-string': 0,
				'require-unicode-regexp': 0,
				'@stylistic/eol-last': 0,
				'@stylistic/max-len': 0,
				'@stylistic/object-curly-spacing': 0,
				'promise/always-return': 0,
				'promise/prefer-await-to-then': 0,
				'unicorn/no-unused-properties': 0,
				'unicorn/prefer-code-point': 0,
			},
		},
	],
};
