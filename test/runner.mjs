import {fileURLToPath} from 'url';
import {basename} from 'path';
import {describe, it, afterEach, beforeEach} from '@bhsd/test-util/mocha';
import '@bhsd/test-util/color';

Object.assign(globalThis, {
	describe,
	it,
	afterEach,
	beforeEach,
	filename(importMetaUrl) {
		return basename(fileURLToPath(importMetaUrl), '.mjs');
	},
	test(title, fn) {
		it(title, fn);
	},
	suite(title, fn) {
		describe(title, fn);
	},
});
