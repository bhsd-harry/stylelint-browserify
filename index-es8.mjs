import lint from './bundle/stylelint-es8.js';

Object.assign(typeof globalThis === 'object' ? globalThis : self, {
	stylelint: {lint},
});
