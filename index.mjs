import lint from './bundle/stylelint.js';

Object.assign(globalThis, {
	stylelint: {lint},
});
