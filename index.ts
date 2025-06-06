import lint from './bundle/stylelint.js'; // eslint-disable-line n/no-missing-import

Object.assign(globalThis, {
	stylelint: {lint},
});
