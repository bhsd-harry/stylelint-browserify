/* eslint-disable require-unicode-regexp */
'use strict';

const path = require('path'),
	fs = require('fs'),
	esbuild = require('esbuild'),
	{red} = require('@bhsd/nodejs');

const shim = [
		// 'augmentConfig', // implicitly shimmed by getConfigForFile
		'createStylelint',
		'descriptionlessDisables',
		'emitWarning',
		'filterFilePaths',
		'fromJSON',
		'getConfigForFile',
		'getFileIgnorer',
		'getFormatter',
		'getReferenceRoots',
		'ident',
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
		'stripComments',
		'suppressionsService',
		'timing',
		'trace',
		'unscopedDisables',
		'warn-once',
	],
	toSorted = 'declaration-block-no-redundant-longhand-properties',
	shimSet = new Set([
		...shim,
		'create',
		'walk',
	]),
	originalSet = new Set(),
	resolvePath = path.join('build', 'resolve'),
	loadPath = path.join('build', 'load'),
	shimPath = path.resolve('shim');

if (!fs.existsSync(resolvePath)) {
	fs.mkdirSync(resolvePath, {recursive: true});
}
if (!fs.existsSync(loadPath)) {
	fs.mkdirSync(loadPath, {recursive: true});
}

let min = false;

const /** @type {esbuild.Plugin} */ plugin = {
	name: 'alias',
	setup(build) {
		build.onResolve(
			{
				filter: new RegExp(
					String.raw`/(?:${
						shim.join('|')
					})(?:\.m?js)?$|/(?:${
						[
							'convertor/create',
							'walk',
						].join('|')
					})\.js$`,
				),
			},
			({path: p, resolveDir}) => {
				const {name, ext} = path.parse(p),
					file = name + (ext || '.js'),
					fullPath = path.join(resolveDir, p);
				if (min && resolveDir !== shimPath) {
					if (!shimSet.has(name) && !originalSet.has(fullPath)) {
						throw new Error(`Ambiguous shim name: ${name}`);
					}
					shimSet.delete(name);
					originalSet.add(fullPath);
					fs.copyFileSync(require.resolve(fullPath), path.resolve(resolvePath, file));
				}
				return {
					path: path.join(shimPath, file),
				};
			},
		);
		build.onLoad(
			{
				filter: new RegExp(
					String.raw`/(?:${toSorted}/index|${
						[
							'lintSource',
							'reportUnknownRuleNames',
							'postcss',
							'standalone',
						].join('|')
					})\.mjs$|/(?:${
						[
							'attribute',
							'lib/container',
							'css-syntax-error',
							'import',
							'lazy-result',
							'Lexer',
							'List',
							'map-generator',
							'lib/node',
							'postcss',
							'dist/processor',
							'lib/processor',
							'structure',
						].join('|')
					})\.js$`,
				),
			},
			({path: p}) => {
				const basename = path.basename(p),
					extname = path.extname(basename),
					original = fs.readFileSync(p, 'utf8');
				let contents = original,
					base = path.basename(basename, extname);
				switch (base) {
					case 'attribute':
						contents = contents.replaceAll(
							/^([ \t]+)_proto\.(getQuotedValue|_determineQuoteMark|setValue|(?:smart|preferred)QuoteMark) = function \2\(.+?^\1\};?$/gmsu,
							'',
						);
						break;
					case 'container':
					case 'node':
						contents = contents.replaceAll(
							/^([ \t]+)(?:getProxyProcessor|toProxy|cleanRaws|replaceValues)\(.+?^\1\}$/gmsu,
							'',
						);
						break;
					case 'css-syntax-error':
						contents = contents.replace(
							/(?<=^([ \t]+)showSourceCode\().+?^\1\}$/msu,
							') { return ""; }',
						);
						break;
					case 'import':
						contents = contents.replace(
							/(?<=^const parseFunctions = \{).+?(?=^\};$)/msu,
							'',
						);
						break;
					case 'index':
						base = path.basename(p.slice(0, p.lastIndexOf('/')));
						if (base === toSorted) {
							contents = contents.replaceAll(
								'.toSorted(',
								'.slice().sort(',
							);
						}
						break;
					case 'lazy-result':
						contents = contents
							.replaceAll(
								/^([ \t]+)(?:catch|finally|then|runOnRoot|handleError|visitTick|(?:visit|walk)Sync)\(.+?^\1\}$/gmsu,
								'',
							)
							.replace(
								/(?<=^([ \t]+)prepareVisitors\().+?^\1\}$/msu,
								') {}',
							)
							.replace(
								/(?<=^([ \t]+)async runAsync\().+?^\1\}$/msu,
								`) {
									this.plugin = 0;
									this.prepareVisitors();
									this.processed = true;
									return this.stringify();
								}`,
							)
							.replace(
								/(?<=^([ \t]+)sync\().+?^\1\}$/msu,
								`) {
									if (this.error) throw this.error;
									if (this.processed) return this.result;
									this.processed = true;
									if (this.processing) throw this.getAsyncError();
									this.prepareVisitors();
									return this.result;
								}`,
							);
						break;
					case 'Lexer':
						contents = contents.replaceAll(
							/^([ \t]+)(?:find\w+Fragments|match|dump|toString|validate|checkStructure|match(?:Declaration|Type)|get(?:Atrule\w+|Type))\(.+?^\1\}$/gmsu,
							'',
						);
						break;
					case 'lintSource':
						contents = contents.replace(
							/(?<=^function createEmptyPostcssResult\().+?^\}/msu,
							') {}',
						);
						break;
					case 'List':
						contents = contents.replaceAll(
							/^([ \t]+)(?:fromArray|forEachRight|copy|(?:next|prev)Until|(?:prepend|insert)Data|(?:pre|ap)pendList)\(.+?^\1\}$/gmsu,
							'',
						);
						break;
					case 'map-generator':
						contents = contents.replaceAll(
							/^([ \t]+)(?!constructor|clearAnnotation|generate\b)\w+\(.+?^\1\}$/gmsu,
							'',
						);
						break;
					case 'postcss':
						contents = contents.replace(
							extname === '.mjs' ? /^export const (?!Node ).+$/gmu : /^postcss\.plugin = .+?^\}$/msu,
							'',
						);
						break;
					case 'processor':
						base = path.basename(p.slice(0, p.lastIndexOf('/')));
						contents = base === 'lib'
							? contents
								.replace(
									/(?<=^([ \t]+)normalize\().+?^\1\}$/msu,
									') { return []; }',
								)
								.replace(
									/^([ \t]+)use\(.+?^\1\}$/msu,
									'',
								)
							: contents.replaceAll(
								/^([ \t]+)_proto\.(_shouldUpdateSelector|_run|ast|process|transform(?:Sync)?) = function \2\d*\(.+?^\1\};?$/gmsu,
								'',
							);
						break;
					case 'reportUnknownRuleNames':
						contents = contents.replace(
							/(?<=^function extractSuggestions\().+?^\}$/msu,
							') { return []; }',
						);
						break;
					case 'standalone':
						contents = contents
							.replace(
								/let fileList = .+?return result;\n\}/su,
								'}',
							)
							.replace(
								/(?<=function postProcessStylelintResult\().+^\}$/msu,
								') {}',
							);
						break;
					case 'structure':
						contents = contents.replace(
							/(?<= = )processStructure\(.+(?=;$)/mu,
							'{}',
						);
					// no default
				}
				if (min) {
					if (basename === 'index.mjs') {
						fs.copyFileSync(p, path.resolve(loadPath, `${base}.mjs`));
					} else if (basename === 'processor.js') {
						fs.copyFileSync(p, path.resolve(loadPath, `${base}-processor.js`));
					} else {
						fs.copyFileSync(p, path.resolve(loadPath, basename));
					}
				}
				if (contents === original) {
					console.error(red(`No changes were made to ${p}`));
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
	bundle: true,
	format: 'esm',
	logLevel: 'info',
	plugins: [plugin],
	alias: {
		debug: './shim/debug.mjs',
		'fast-glob': './shim/fast-glob.mjs',
		'fastest-levenshtein': './shim/fastest-levenshtein.mjs',
		'node:fs/promises': './shim/fs-promises.mjs',
		globby: './shim/globby.mjs',
		'mathml-tag-names': './shim/mathml-tag-names.mjs',
		micromatch: './shim/micromatch.mjs',
		'nanoid/non-secure': './shim/nanoid.js',
		'normalize-path': './shim/normalize-path.mjs',
		'node:os': './shim/os.mjs',
		path: './shim/path.mjs',
		'node:path': './shim/path.mjs',
		picocolors: './shim/picocolors.js',
		'postcss-safe-parser': './shim/postcss-safe-parser.js',
		'node:process': './shim/process.mjs',
		'stylelint/lib/formatters/jsonFormatter': path.join(stylelint, '..', 'formatters', 'jsonFormatter.mjs'),
		'stylelint/lib/normalizeAllRuleSettings': path.join(stylelint, '..', 'normalizeAllRuleSettings.mjs'),
		'svg-tags': './shim/svg-tags.js',
		'node:url': './shim/url.mjs',
		'util-deprecate': './shim/util-deprecate.js',
		'write-file-atomic': './shim/write-file-atomic.mjs',
	},
};

(async () => {
	await esbuild.build(config);
	min = true;
	await esbuild.build({
		...config,
		minify: true,
		outfile: 'bundle/standalone.min.js',
		legalComments: 'external',
	});
	if (shimSet.size > 0) {
		console.error(
			red('The following shims were not used in the bundle: ') + [...shimSet].join(', '),
		);
	}
})();
