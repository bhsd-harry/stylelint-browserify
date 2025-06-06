import lint from './bundle/stylelint-es8.js'; // eslint-disable-line n/no-missing-import

Object.assign(typeof globalThis === 'object' ? globalThis : self, { // eslint-disable-line unicorn/prefer-global-this
	stylelint: {lint},
});
