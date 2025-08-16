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
			files: ['test/tests/*.mjs'],
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
				'arrow-body-style': 0,
				'no-irregular-whitespace': 0,
				'no-template-curly-in-string': 0,
				'require-unicode-regexp': 0,
				'@stylistic/array-bracket-newline': 0,
				'@stylistic/arrow-parens': 0,
				'@stylistic/eol-last': 0,
				'@stylistic/max-len': 0,
				'@stylistic/no-extra-parens': 0,
				'@stylistic/object-curly-spacing': 0,
				'@stylistic/operator-linebreak': 0,
				'@stylistic/quotes': 0,
				'regexp/letter-case': 0,
				'regexp/prefer-character-class': 0,
				'promise/always-return': 0,
				'promise/prefer-await-to-then': 0,
				'unicorn/no-unused-properties': 0,
				'unicorn/numeric-separators-style': 0,
				'unicorn/prefer-code-point': 0,
				'unicorn/prefer-string-raw': 0,
			},
		},
	],
};
