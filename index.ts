import lint from './build/stylelint.js'; // eslint-disable-line n/no-missing-import

Object.assign(globalThis, {
	stylelint: {lint},
});
