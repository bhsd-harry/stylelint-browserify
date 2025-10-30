/* eslint-env mocha */
/* global stylelint */
import assert from 'assert';
import {fileURLToPath} from 'url';
import {basename} from 'path';

const partial = ({line, column, endLine, endColumn, fix}) =>
	JSON.parse(JSON.stringify({line, column, endLine, endColumn, fix}));

Object.assign(globalThis, {
	filename(importMetaUrl) {
		return basename(fileURLToPath(importMetaUrl), '.mjs');
	},
	testRule({ruleName, config, accept = [], reject = [], computeEditInfo, customSyntax, languageOptions}) {
		if (customSyntax || languageOptions) {
			describe.skip(ruleName, () => {
				for (const {code, description = ''} of reject) {
					it(`reject: ${description}\n${code}`);
				}
				for (const {code, description = ''} of accept) {
					it(`accept: ${description}\n${code}`);
				}
			});
			return;
		}
		const cfg = {rules: {[ruleName]: config}, computeEditInfo};
		describe(ruleName, () => {
			for (const {skip, code, fixed, fix, line, column, endLine, endColumn, warnings, description} of reject) {
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
					assert.partialDeepStrictEqual( // eslint-disable-line n/no-unsupported-features/node-builtins
						(await stylelint.lint({code, config: cfg})).results[0].warnings,
						(warnings ?? [{fix, line, column, endLine, endColumn}]).map(partial),
					);
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
