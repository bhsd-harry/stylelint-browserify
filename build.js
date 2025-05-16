'use strict';

const path = require('path'),
	fs = require('fs'),
	esbuild = require('esbuild');

const shim = [
		'FileCache',
		'allFilesIgnoredError',
		'augmentConfig',
		'dynamicImport',
		'emitDeprecationWarning',
		'filterFilePaths',
		'fromJSON',
		'getConfigForFile',
		'getFileIgnorer',
		'getFormatter',
		'getModulePath',
		'isPathIgnored',
		'isPathNotFoundError',
		'noFilesFoundError',
		'previous-map',
		'sourceMap',
		'timing',
	],
	shimSet = new Set(shim),
	at = [
		'function-calc-no-unspaced-operator',
		'selector-no-qualifying-type',
	],
	replaceAll = [
		'no-descending-specificity',
		'selector-pseudo-element-colon-notation',
		'unit-allowed-list',
	];

const plugin = {
	name: 'alias',
	setup(build) {
		build.onResolve(
			// eslint-disable-next-line require-unicode-regexp
			{filter: new RegExp(String.raw`/(?:${shim.join('|')})(?:\.m?js)?$`)},
			({path: p}) => {
				const {name, ext} = path.parse(p);
				shimSet.delete(name);
				return {
					path: path.resolve('shim', name + (ext || '.js')),
				};
			},
		);
		build.onLoad(
			{
				// eslint-disable-next-line require-unicode-regexp
				filter: new RegExp(
					String.raw`/(?:(?:${
						[...at, ...replaceAll].join('|')
					})/index|getStrippedSelectorSource)\.mjs$`,
				),
			},
			({path: p}) => {
				let contents = fs.readFileSync(p, 'utf8');
				if (p.endsWith('/getStrippedSelectorSource.mjs')) {
					contents = contents.replace(
						/ = (\S+)\.findLastIndex\(/gu,
						' = $1.length - 1 - $1.reverse().findIndex(',
					);
				} else {
					const base = path.basename(p.slice(0, -'/index.mjs'.length));
					contents = at.includes(base)
						? contents.replace(/\b(\w+)\.at\(-1\)/gu, '$1[$1.length - 1]')
						: contents.replace(/\.replaceAll\('(.)'/gu, String.raw`.replace(/\$1/g`);
				}
				return {contents};
			},
		);
	},
};

(async () => {
	await esbuild.build({
		entryPoints: ['./node_modules/stylelint/lib/standalone.mjs'],
		charset: 'utf8',
		bundle: true,
		format: 'esm',
		target: 'es2019',
		outfile: 'bundle/stylelint.js',
		legalComments: 'external',
		logLevel: 'info',
		alias: {
			cosmiconfig: './shim/cosmiconfig.mjs',
			debug: './shim/debug.mjs',
			'fast-glob': './shim/fast-glob.mjs',
			'node:fs': './shim/fs.mjs',
			'node:fs/promises': './shim/fs-promises.mjs',
			globby: './shim/globby.mjs',
			'node:module': './shim/module.js',
			'normalize-path': './shim/normalize-path.mjs',
			'node:os': './shim/os.mjs',
			'node:path': './shim/path.mjs',
			'node:process': './shim/process.mjs',
			'util-deprecate': './shim/util-deprecate.js',
			'write-file-atomic': './shim/write-file-atomic.mjs',
		},
		plugins: [plugin],
	});
	if (shimSet.size > 0) {
		console.error(
			`The following shims were not used in the bundle: ${[...shimSet].join(', ')}`,
		);
	}
})();
