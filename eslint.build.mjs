import {dist} from '@bhsd/code-standard';
import esX from 'eslint-plugin-es-x';

export default [
	dist,
	{
		languageOptions: {
			globals: {
				process: 'readonly',
			},
		},
		rules: {
			'no-undef': 2,
			'es-x/no-array-prototype-at': 0,
			'es-x/no-string-prototype-at': 0,
		},
	},
	{
		files: ['build/stylelint-es*.js'],
		rules: {
			...esX.configs['flat/no-new-in-es2018'].rules,
			...esX.configs['flat/no-new-in-es2019'].rules,
			...esX.configs['flat/no-new-in-es2020'].rules,
			'es-x/no-global-this': 0,
		},
	},
];
