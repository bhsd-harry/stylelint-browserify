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
];
