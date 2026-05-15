import {version} from 'stylelint/package.json';
import lint from './bundle/standalone.min.js'; // eslint-disable-line n/no-missing-import

Object.assign(globalThis, {
	stylelint: {lint, version},
});
