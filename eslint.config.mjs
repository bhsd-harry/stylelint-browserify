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
		linterOptions: {
			reportUnusedDisableDirectives: 0,
		},
		rules: {
			'no-irregular-whitespace': 0,
			'no-shadow': 0,
			'no-template-curly-in-string': 0,
			'no-underscore-dangle': 0,
			'no-unused-vars': 0,
			'prefer-destructuring': 0,
			'require-await': 0,
			'require-unicode-regexp': 0,
			'@stylistic/max-len': 0,
			'@stylistic/no-extra-parens': 0,
			'@stylistic/no-tabs': 0,
			'promise/always-return': 0,
			'promise/prefer-await-to-then': 0,
			'unicorn/no-unused-properties': 0,
			'unicorn/prefer-code-point': 0,
			'jsdoc/check-indentation': 0,
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
			strict: [
				2,
				'never',
			],
			'jsdoc/require-jsdoc': 0,
		},
	},
	{
		files: [
			'shim/create.js',
			'shim/ident.js',
			'shim/sourceMap.js',
			'shim/walk.js',
		],
		languageOptions: {
			sourceType: 'module',
		},
	},
);
