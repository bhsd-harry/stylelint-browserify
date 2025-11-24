'use strict';

/* eslint-disable n/no-extraneous-require */
const data1 = require('css-functions-list/index.json'),
	data2 = require('mathml-tag-names/index.json'),
	data3 = require('@csstools/css-syntax-patches-for-csstree/dist/index.json');
/* eslint-enable n/no-extraneous-require */

const r = id => {
	switch (id) {
		case 'css-functions-list/index.json':
			return data1;
		case 'mathml-tag-names/index.json':
			return data2;
		case '@csstools/css-syntax-patches-for-csstree/dist/index.json':
			return data3;
		default:
			return undefined;
	}
};

module.exports.createRequire = () => r;
