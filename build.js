'use strict';

const path = require('path'),
	fs = require('fs'),
	esbuild = require('esbuild');

const shim = [
		'FileCache',
		'augmentConfig',
		'descriptionlessDisables',
		'dynamicImport',
		'emitDeprecationWarning',
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
		'no-work-result',
		'previous-map',
		'sourceMap',
		'timing',
		'unscopedDisables',
	],
	at = [
		'function-calc-no-unspaced-operator',
		'selector-no-qualifying-type',
	],
	replaceAll = [
		'no-descending-specificity',
		'selector-pseudo-element-colon-notation',
		'unit-allowed-list',
	],
	flatRule = [],
	flatRule2 = [],
	flatMapRule = [],
	trimStart = [],
	trimEnd = [],
	match = [],
	matchAll = [],
	findLastIndex = ['getStrippedSelectorSource'],
	dotAll = [],
	flat = [],
	flat2 = [],
	flatMap = [],
	shimSet = new Set(shim);
let csstools = false;

const reduce = '.reduce((acc, cur) => acc.concat(cur), [])',

	/**
	 * Polyfill for Array.prototype.flat
	 * @param {string} s source code
	 */
	replaceFlat = s => s.replace(
		/\[([\w.]+)\]\.flat\(\)/gu,
		'(Array.isArray($1) ? $1 : [$1])',
	),

	/**
	 * Polyfill for Array.prototype.flat
	 * @param {string} s source code
	 */
	replaceFlat2 = s => s.replaceAll('.flat()', reduce);

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
						[
							...at,
							...replaceAll,
							...flatRule,
							...flatRule2,
							...flatMapRule,
							...trimStart,
							...trimEnd,
							...match,
							...matchAll,
						].join('|')
					})/index|${
						[
							'standalone',
							'getPostcssResult',
							'lintSource',
							'reportUnknownRuleNames',
							'normalizeFixMode',
							...findLastIndex,
							...dotAll,
							...flat,
							...flat2,
							...flatMap,
						].join('|')
					})\.mjs$|/map-generator\.js$|/@csstools/`,
				),
			},
			({path: p}) => {
				let contents = fs.readFileSync(p, 'utf8'),
					base = path.basename(p.slice(0, -path.extname(p).length));
				if (csstools && p.includes('/@csstools/')) {
					contents = contents.replace(
						/\.flatMap\((\(\w+=>\w+\.tokens\(\)\))\)/gu,
						`.map($1)${reduce}`,
					);
				} else if (base === 'index') {
					base = path.basename(p.slice(0, -'/index.mjs'.length));
					if (at.includes(base)) {
						contents = contents.replace(
							/\b(\w+)\.at\(-1\)/gu,
							'$1[$1.length - 1]',
						);
					}
					if (replaceAll.includes(base)) {
						contents = contents.replace(
							/\.replaceAll\('(.)'/gu,
							String.raw`.replace(/\$1/g`,
						);
					}
					if (flatRule.includes(base)) {
						contents = replaceFlat(contents);
					}
					if (flatRule2.includes(base)) {
						contents = replaceFlat2(contents);
					}
					if (flatMapRule.includes(base)) {
						contents = contents.replace(
							/ = (.+)\.flatMap\(/gu,
							' = flattenMap($1, ',
						);
					}
					if (trimStart.includes(base)) {
						contents = contents.replaceAll('.trimStart()', String.raw`.replace(/^\s+/u, '')`);
					}
					if (trimEnd.includes(base)) {
						contents = contents.replaceAll('.trimEnd()', String.raw`.replace(/\s+$/u, '')`);
					}
					if (match.includes(base)) {
						contents = contents.replace(
							/\[\.{3}(\w+)\.matchAll\((.+?)\)\]\.map\(.+\);$/gmu,
							'$1.match($2);',
						);
					}
					if (matchAll.includes(base)) {
						contents = contents.replace(
							/\b(\w+)\.matchAll\((\w+)\)/gu,
							'($2.lastIndex = 0, [$2.exec($1)].filter(Boolean))',
						);
					}
				} else {
					switch (base) {
						case 'standalone':
							contents = contents.replace(
								/let fileList = .+?return result;\n\}/su,
								'}',
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
								// eslint-disable-next-line @stylistic/max-len
								/^([ \t]+)(?:addAnnotation|applyPrevMaps|generateMap|generateString|isAnnotation|isInline|isMap|isSourcesContent|outputFile|path|previous|setSourcesContent|sourcePath|toBase64|toFileUrl|toUrl)\(.+?^\1\}$/gmsu,
								'',
							);
							break;
						case 'normalizeFixMode':
							contents = contents.replace(
								'return DEFAULT_FIX_MODE',
								"return 'strict'",
							);
							break;
						case 'reportUnknownRuleNames':
							contents = contents.replace(
								/^(function extractSuggestions)\(.+?^\}$/msu,
								'$1() { return []; }',
							);
						// no default
					}
					if (findLastIndex.includes(base)) {
						contents = contents.replace(
							/ = (\S+)\.findLastIndex\(/gu,
							' = $1.length - 1 - $1.reverse().findIndex(',
						);
					}
					if (dotAll.includes(base)) {
						contents = contents.replace(
							/ = \/(.+)\/s;/gu,
							(_, source) => ` = /${source.replaceAll('.', String.raw`[\s\S]`)}/;`,
						);
					}
					if (flat.includes(base)) {
						contents = replaceFlat(contents);
					}
					if (flat2.includes(base)) {
						contents = replaceFlat2(contents);
					}
					if (flatMap.includes(base)) {
						contents = contents.replace(
							/\s(\w+|\[\.{3}\w+\])\.flatMap\(/gu,
							' flattenMap($1, ',
						);
					}
				}
				return {contents};
			},
		);
	},
};

const config = {
	entryPoints: ['./node_modules/stylelint/lib/standalone.mjs'],
	charset: 'utf8',
	bundle: true,
	format: 'esm',
	logLevel: 'info',
	alias: {
		cosmiconfig: './shim/cosmiconfig.mjs',
		debug: './shim/debug.mjs',
		'fast-glob': './shim/fast-glob.mjs',
		'fastest-levenshtein': './shim/fastest-levenshtein.mjs',
		'node:fs': './shim/fs.mjs',
		'node:fs/promises': './shim/fs-promises.mjs',
		globby: './shim/globby.mjs',
		'node:module': './shim/module.js',
		'normalize-path': './shim/normalize-path.mjs',
		'node:os': './shim/os.mjs',
		'node:path': './shim/path.mjs',
		'postcss-safe-parser': './shim/postcss-safe-parser.mjs',
		'node:process': './shim/process.mjs',
		'util-deprecate': './shim/util-deprecate.js',
		'write-file-atomic': './shim/write-file-atomic.mjs',
	},
};

(async () => {
	await esbuild.build({
		...config,
		target: 'es2019',
		outfile: 'bundle/stylelint.js',
		legalComments: 'external',
		plugins: [plugin],
	});
	if (shimSet.size > 0) {
		console.error(
			`The following shims were not used in the bundle: ${[...shimSet].join(', ')}`,
		);
	}

	flatRule.push(
		'at-rule-allowed-list',
		'at-rule-disallowed-list',
		'declaration-property-unit-allowed-list',
		'declaration-property-unit-disallowed-list',
		'media-feature-name-unit-allowed-list',
		'media-feature-name-value-allowed-list',
		'selector-attribute-operator-allowed-list',
		'selector-attribute-operator-disallowed-list',
		'unit-allowed-list',
		'unit-disallowed-list',
	);
	flatRule2.push('declaration-block-no-redundant-longhand-properties', 'value-no-vendor-prefix');
	flatMapRule.push('no-duplicate-selectors');
	trimStart.push('function-url-quotes', 'no-invalid-double-slash-comments');
	trimEnd.push('function-linear-gradient-no-nonstandard-direction');
	dotAll.push('hasScssInterpolation', 'hasTplInterpolation');
	flat.push('validateOptions');
	flat2.push('validateObjectWithArrayProps', 'findNotContiguousOrRectangular');
	flatMap.push('findMediaFeatureNames', 'mediaFeatures');
	match.push('declaration-block-no-redundant-longhand-properties');
	matchAll.push('no-irregular-whitespace');
	csstools = true;
	await esbuild.build({
		...config,
		target: 'es2016',
		outfile: 'bundle/stylelint-es7.js',
		legalComments: 'none',
		plugins: [plugin],
		banner: {
			js: `const flattenMap = (arr, fn) => arr.map(fn)${reduce};`,
		},
	});
})();
