import {dist} from '@bhsd/code-standard';

export default [
	dist,
	{
		rules: {
			'no-undef': 2,
			'es-x/no-iterator-prototype-toarray': 0,
		},
	},
];
