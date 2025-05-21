import lint from './bundle/stylelint-es7.js';

Object.assign(typeof globalThis === 'object' ? globalThis : self, {
	stylelint: {lint},
});
