import assert from 'assert';
import {prepare} from '@bhsd/test-util/mocha';

const isSkip = process.argv[2] === 'skip';

const partial = obj => JSON.parse(JSON.stringify(obj)), // oxlint-disable-line unicorn/prefer-structured-clone
	partialWarn = ({line, column, endLine, endColumn, fix}) => partial({line, column, endLine, endColumn, fix});

export default (
	{ruleName, config, accept: acc = [], reject: rej = [], computeEditInfo, customSyntax, languageOptions},
) => {
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
						(warnings ?? [{fix, line, column, endLine, endColumn}]).map(warning => partialWarn(warning)),
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
};
