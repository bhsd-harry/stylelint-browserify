import process from 'node:process'; // eslint-disable-line no-shadow

export default (options = {}) => {
	const cwd = options.cwd || process.cwd();

	return {
		_options: {...options, cwd},
		_postcssResultCache: new Map(),
	};
};
