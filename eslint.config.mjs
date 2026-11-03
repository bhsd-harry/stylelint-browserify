import {jsDoc, node, extend, getOxlintConfig} from '@bhsd/code-standard';

const config = getOxlintConfig(extend(
	jsDoc,
	...node,
	{
		ignores: [
			'bundle/',
			'coverage/',
			'index-coverage.mjs',
		],
	},
	{
		files: ['test/**/*.mjs'],
		languageOptions: {
			globals: {
				afterEach: 'readonly',
				beforeEach: 'readonly',
				describe: 'readonly',
				filename: 'readonly',
				it: 'readonly',
				stylelint: 'readonly',
				suite: 'readonly',
				test: 'readonly',
			},
		},
		linterOptions: {
			reportUnusedDisableDirectives: 0,
		},
		rules: {
			'jsdoc/require-param-description': 0,
		},
		settings: {
			node: {
				version: '>=24.0.0',
			},
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
		],
		languageOptions: {
			sourceType: 'module',
		},
	},
));

export default config;
