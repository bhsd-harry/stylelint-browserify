/* eslint-env mocha */
/* global stylelint */
'use strict';

const assert = require('assert'),
	{lint} = require('stylelint'),
	standalone = require('../build/stylelint.js').default,
	tests = require('./tests');

const runTests = (title, f) => {
	describe(title, () => {
		for (const {desc, code, rules, warnings} of tests) {
			it(desc, async () => {
				const {results: [result]} = await f({code, config: {rules}});
				assert.deepStrictEqual(
					result.warnings.map(
						({line, column, endLine, endColumn, rule, severity, text}) =>
							({line, column, endLine, endColumn, rule, severity, text}),
					),
					warnings,
				);
			});
		}
	});
};

runTests('Stylelint', lint);
runTests('bundled Stylelint', standalone);
runTests('minified Stylelint', stylelint.lint);
