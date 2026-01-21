import {jsDoc, node, extend} from '@bhsd/code-standard';
import globals from 'globals';

export default extend(
	jsDoc,
	...node,
	{
		ignores: [
			'bundle/',
			'coverage/',
		],
	},
	{
		files: ['test/**/*.mjs'],
		languageOptions: {
			globals: {
				...globals.mocha,
				expect: 'readonly',
				filename: 'readonly',
				stylelint: 'readonly',
				testRule: 'readonly',
				testRuleConfigs: 'readonly',
			},
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
	{
		files: [
			'shim/*.js',
			'shim/*.mjs',
		],
		rules: {
			'no-underscore-dangle': [
				2,
				{
					allow: [
						'_',
						'_options',
					],
					enforceInMethodNames: true,
					enforceInClassFields: true,
					allowInArrayDestructuring: false,
					allowInObjectDestructuring: false,
					allowFunctionParams: false,
				},
			],
			'jsdoc/require-jsdoc': 0,
		},
	},
	{
		files: ['shim/sourceMap.js'],
		languageOptions: {
			sourceType: 'module',
		},
	},
);
