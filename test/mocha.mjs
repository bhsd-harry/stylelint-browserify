/* eslint-env mocha */
import assert from 'assert';
import {fileURLToPath} from 'url';
import {basename} from 'path';

const clean = obj => JSON.parse(JSON.stringify(obj));

const partial = ({line, column, endLine, endColumn}) => clean({line, column, endLine, endColumn});

Object.assign(globalThis, {
	filename(importMetaUrl) {
		return basename(fileURLToPath(importMetaUrl), '.mjs');
	},
	testRule({ruleName, config, accept = [], reject = [], computeEditInfo, customSyntax, languageOptions}) {
		if (customSyntax || languageOptions) {
			describe.skip(ruleName, () => {
				for (const {code, description = ''} of reject) {
					it(`reject: ${description}\n${code}`, () => {});
				}
				for (const {code, description = ''} of accept) {
					it(`accept: ${description}\n${code}`, () => {});
				}
			});
			return;
		}
		const cfg = {rules: {[ruleName]: config}, computeEditInfo};
		describe(ruleName, () => {
			for (const {skip, code, fixed, fix, line, column, endLine, endColumn, warnings, description = ''} of reject) {
				if (skip) {
					it.skip(`reject: ${description}\n${code}`);
					continue;
				}
				it(`reject: ${description}\n${code}`, async () => {
					if (fixed) {
						assert.strictEqual(
							(await stylelint.lint({code, config: {...cfg, fix: true}})).code,
							fixed,
						);
					}
					const actual = (await stylelint.lint({code, config: cfg})).results[0].warnings
							.map(warning => ({
								fix: warning.fix,
								line: (warnings?.[0].line || line) && warning.line,
								column: (warnings?.[0].column || column) && warning.column,
								endLine: (warnings?.[0].endLine || endLine) && warning.endLine,
								endColumn: (warnings?.[0].endColumn || endColumn) && warning.endColumn,
							})),
						expected = warnings ?? [{fix, line, column, endLine, endColumn}];
					assert.deepStrictEqual(actual.map(partial), expected.map(partial));
					for (let i = 0; i < actual.length; i++) {
						const expectedFix = expected[i].fix;
						if (expectedFix) {
							const actualFix = actual[i].fix;
							assert.deepStrictEqual(
								clean({
									range: expectedFix.range && actualFix?.range,
									text: expectedFix.text && actualFix?.text,
								}),
								expectedFix,
							);
						}
					}
				});
			}
			for (const {code, description = ''} of accept) {
				it(`accept: ${description}\n${code}`, async () => {
					assert.deepStrictEqual(
						(await stylelint.lint({code, config: cfg})).results[0].warnings,
						[],
					);
				});
			}
		});
	},
	testRuleConfigs() {
		//
	},
	expect() {
		//
	},
});
