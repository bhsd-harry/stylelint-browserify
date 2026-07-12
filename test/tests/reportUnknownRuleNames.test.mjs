import standalone from '../standalone.mjs';

it('test case (1)', async () => {
	const config = {
		rules: {
			'color-namd': ['always-where-possible'],
			'function-allowed-lst': ['scale'],
		},
	};

	const {results} = await standalone({
		config,
		code: 'a {}',
	});

	expect(results).toHaveLength(1);
	expect(results[0].warnings).toMatchObject([
		{
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 2,
			severity: 'error',
			rule: 'color-namd',
			text: 'Unknown rule color-namd.',
		},
		{
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 2,
			severity: 'error',
			rule: 'function-allowed-lst',
			text: 'Unknown rule function-allowed-lst.',
		},
	]);
});

it('test case (2)', async () => {
	const config = {
		rules: {
			'color-named': ['always-where-possible'],
			'function-allowed-lst': ['rgb'],
		},
	};

	const {results} = await standalone({
		config,
		code: 'a { color: #fff; transform: scale(0.7); }',
	});

	expect(results).toHaveLength(1);
	expect(results[0].warnings).toMatchObject([
		{
			line: 1,
			column: 1,
			endLine: 1,
			endColumn: 2,
			severity: 'error',
			rule: 'function-allowed-lst',
			text: 'Unknown rule function-allowed-lst.',
		},
		expect.objectContaining({
			severity: 'error',
			rule: 'color-named',
			text: expect.stringMatching('#fff'),
		}),
	]);
});
