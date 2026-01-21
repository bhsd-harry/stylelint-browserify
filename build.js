/* eslint-disable require-unicode-regexp */
'use strict';

const path = require('path'),
	fs = require('fs'),
	esbuild = require('esbuild');

const shim = [
		// 'augmentConfig', // implicitly shimmed by getConfigForFile
		'createStylelint',
		'descriptionlessDisables',
		'dynamicImport',
		'emitWarning',
		'filterFilePaths',
		'fromJSON',
		'getConfigForFile',
		'getFileIgnorer',
		'getFormatter',
		'getModulePath',
		'invalidScopeDisables',
		'isPathIgnored',
		'isPathNotFoundError',
		'needlessDisables',
		'normalizeFilePath',
		'normalizeFixMode',
		'no-work-result',
		'previous-map',
		'resolveFilePath',
		'sourceMap',
		'suppressionsService',
		'timing',
		'unscopedDisables',
	],
	at = [
		'function-calc-no-unspaced-operator',
		'selector-no-qualifying-type',
	],
	replaceAll = [
		'lightness-notation',
		'no-descending-specificity',
		'selector-pseudo-element-colon-notation',
		'unit-allowed-list',
	],
	findLastIndex = ['getStrippedSelectorSource'],
	toSorted = ['declaration-block-no-redundant-longhand-properties'],
	shimSet = new Set(shim),
	resolvePath = path.join('build', 'resolve'),
	loadPath = path.join('build', 'load'),
	shimPath = path.resolve('shim');

if (!fs.existsSync(resolvePath)) {
	fs.mkdirSync(resolvePath, {recursive: true});
}
if (!fs.existsSync(loadPath)) {
	fs.mkdirSync(loadPath, {recursive: true});
}

const /** @type {esbuild.Plugin} */ plugin = {
	name: 'alias',
	setup(build) {
		build.onResolve(
			{filter: new RegExp(String.raw`/(?:${shim.join('|')})(?:\.m?js)?$`)},
			({path: p, resolveDir}) => {
				const {name, ext} = path.parse(p),
					file = name + (ext || '.js');
				if (resolveDir !== shimPath) {
					shimSet.delete(name);
					fs.copyFileSync(require.resolve(path.join(resolveDir, p)), path.resolve(resolvePath, file));
				}
				return {
					path: path.join(shimPath, file),
				};
			},
		);
		build.onLoad(
			{
				filter: new RegExp(
					String.raw`/(?:(?:${
						[
							...at,
							...replaceAll,
							...toSorted,
						].join('|')
					})/index|${
						[
							'standalone',
							'getPostcssResult',
							'lintSource',
							'reportUnknownRuleNames',
							...findLastIndex,
						].join('|')
					})\.mjs$|/(?:map-generator|postcss)\.js$`,
				),
			},
			({path: p}) => {
				const basename = path.basename(p);
				let contents = fs.readFileSync(p, 'utf8'),
					base = path.basename(basename, path.extname(basename));
				if (base === 'index') {
					base = path.basename(p.slice(0, p.lastIndexOf('/')));
					if (at.includes(base)) {
						contents = contents.replace(
							/\.at\(-1\)/gu,
							'.slice(-1)[0]',
						);
					}
					if (replaceAll.includes(base)) {
						contents = contents.replace(
							/\.replaceAll\('(.)'/gu,
							String.raw`.replace(/\$1/g`,
						);
					}
					if (toSorted.includes(base)) {
						contents = contents.replace(
							/\.toSorted\(/gu,
							'.slice().sort(',
						);
					}
				} else {
					switch (base) {
						case 'standalone':
							contents = contents.replace(
								/let fileList = .+?return result;\n\}/su,
								'}',
							).replace(
								/(?<=function postProcessStylelintResult\().+^\}$/msu,
								') {}',
							);
							break;
						case 'getPostcssResult':
							contents = contents.replace(
								/^async function getCustomSyntax\(.+?^\}$/msu,
								'function getCustomSyntax() {}',
							);
							break;
						case 'lintSource':
							contents = contents.replace(
								/^(function createEmptyPostcssResult)\(.+?^\}/msu,
								'function createEmptyPostcssResult() {}',
							);
							break;
						case 'map-generator':
							contents = contents.replace(
								/^([ \t]+)(?!constructor|clearAnnotation|generate\b)\w+\(.+?^\1\}$/gmsu,
								'',
							);
							break;
						case 'postcss':
							contents = contents.replace(
								/^postcss\.plugin = .+?^\}$/msu,
								'',
							);
							break;
						case 'reportUnknownRuleNames':
							contents = contents.replace(
								/(?<=^function extractSuggestions)\(.+?^\}$/msu,
								'() { return []; }',
							);
						// no default
					}
					if (findLastIndex.includes(base)) {
						contents = contents.replace(
							/ = (\S+)\.findLastIndex\(/gu,
							' = $1.length - 1 - $1.slice().reverse().findIndex(',
						);
					}
				}
				if (basename !== 'index.mjs') {
					fs.copyFileSync(p, path.resolve(loadPath, basename));
				}
				return {contents};
			},
		);
	},
};

const stylelint = require.resolve('stylelint');
const /** @type {esbuild.BuildOptions} */ config = {
	entryPoints: [path.join(stylelint, '..', 'standalone.mjs')],
	outfile: 'build/stylelint.js',
	charset: 'utf8',
	target: 'es2019',
	bundle: true,
	format: 'esm',
	logLevel: 'info',
	plugins: [plugin],
	alias: {
		debug: './shim/debug.mjs',
		'fast-glob': './shim/fast-glob.mjs',
		'fastest-levenshtein': './shim/fastest-levenshtein.mjs',
		'node:fs': './shim/fs.mjs',
		'node:fs/promises': './shim/fs-promises.mjs',
		globby: './shim/globby.mjs',
		'mathml-tag-names': './shim/mathml-tag-names.mjs',
		'normalize-path': './shim/normalize-path.mjs',
		'node:os': './shim/os.mjs',
		'node:path': './shim/path.mjs',
		picocolors: './shim/picocolors.js',
		'postcss-safe-parser': './shim/postcss-safe-parser.js',
		'node:process': './shim/process.mjs',
		'stylelint/lib/formatters/jsonFormatter': path.join(stylelint, '..', 'formatters', 'jsonFormatter.mjs'),
		'stylelint/lib/normalizeAllRuleSettings': path.join(stylelint, '..', 'normalizeAllRuleSettings.mjs'),
		'svg-tags': './shim/svg-tags.js',
		'util-deprecate': './shim/util-deprecate.js',
		'write-file-atomic': './shim/write-file-atomic.mjs',
	},
};

(async () => {
	await esbuild.build(config);
	if (shimSet.size > 0) {
		console.error(
			`The following shims were not used in the bundle: ${[...shimSet].join(', ')}`,
		);
	}
})();
