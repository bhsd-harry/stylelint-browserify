import {dist} from '@bhsd/code-standard';

export default [
	dist,
	{
		rules: {
			'no-undef': 2,
			'es-x/no-array-prototype-at': 0,
			'es-x/no-iterator-prototype-toarray': 0,
			'es-x/no-string-prototype-at': 0,
		},
	},
	{
		files: ['build/*.js'],
		rules: {
			'es-x/no-class-instance-fields': 0,
			'es-x/no-class-private-fields': 0,
			'es-x/no-class-private-methods': 0,
			'es-x/no-logical-assignment-operators': 0,
		},
	},
];
