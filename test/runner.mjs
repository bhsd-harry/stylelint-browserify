/* eslint-disable unicorn/prefer-structured-clone */
import assert from 'assert';
import {fileURLToPath} from 'url';
import {basename} from 'path';
import {describe, it, beforeEach, prepare} from '@bhsd/test-util/mocha';

const isSkip = process.argv[2] === 'skip';

const partial = ({line, column, endLine, endColumn, fix}) =>
	JSON.parse(JSON.stringify({line, column, endLine, endColumn, fix}));

Object.assign(globalThis, {
	describe,
	it,
	beforeEach,
	filename(importMetaUrl) {
		return basename(fileURLToPath(importMetaUrl), '.mjs');
	},
	testRule({ruleName, config, accept: acc = [], reject: rej = [], computeEditInfo, customSyntax, languageOptions}) {
		if (customSyntax || languageOptions) {
			describe.skip(ruleName, () => {
				for (const {code, description = ''} of rej) {
					it(`reject: ${description}\n${code}`);
				}
				for (const {code, description = ''} of acc) {
					it(`accept: ${description}\n${code}`);
				}
			});
			return;
		}
		const cfg = {rules: {[ruleName]: config}, computeEditInfo};
		describe(ruleName, () => {
			if (isSkip) {
				prepare(rej.length + acc.length);
			} else {
				for (const {skip, code, fixed, fix, line, column, endLine, endColumn, warnings, description} of rej) {
					if (skip) {
						it.skip(`reject: ${description ?? ''}\n${code}`);
						continue;
					}
					it(`reject: ${description}\n${code}`, async () => {
						if (fixed) {
							assert.strictEqual(
								(await stylelint.lint({code, config: {...cfg, fix: true}})).code,
								fixed,
							);
						}
						assert.partialDeepStrictEqual(
							(await stylelint.lint({code, config: cfg})).results[0].warnings,
							(warnings ?? [{fix, line, column, endLine, endColumn}]).map(warning => partial(warning)),
						);
					});
				}
				for (const {code, description = ''} of acc) {
					it(`accept: ${description}\n${code}`, async () => {
						assert.deepStrictEqual(
							(await stylelint.lint({code, config: cfg})).results[0].warnings,
							[],
						);
					});
				}
			}
		});
	},
	testRuleConfigs() {
		//
	},
	expect(actual) {
		return {
			rejects: {
				async toThrow(expected) {
					try {
						await actual();
					} catch (e) {
						assert.deepStrictEqual(e, expected);
					}
				},
			},
			not: {toThrow: actual},
			toContain(expected) {
				assert.ok(actual.includes(expected));
			},
			toHaveLength(expected) {
				assert.strictEqual(actual.length, expected);
			},
			toBe(expected) {
				assert.strictEqual(actual, expected);
			},
			toBeUndefined() {
				assert.strictEqual(actual, undefined);
			},
			toBeTruthy() {
				assert.ok(actual);
			},
			toEqual(expected) {
				assert.deepStrictEqual(JSON.parse(JSON.stringify(actual)), expected);
			},
			toContainEqual(expected) {
				assert.ok(
					actual.some(item => {
						try {
							assert.partialDeepStrictEqual(item, expected);
							return true;
						} catch {
							return false;
						}
					}),
				);
			},
		};
	},
	test(title, fn) {
		it(title, fn);
	},
	suite(title, fn) {
		describe(title, fn);
	},
});
expect.objectContaining = obj => obj;
