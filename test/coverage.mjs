import fs from 'fs';
import path from 'path';
import {updateBadge} from '@bhsd/test-util';
import coverageData from '../coverage/coverage.json' with {type: 'json'};

const filePath = fs.realpathSync(path.join('build', 'stylelint.js')),
	fileCoverage = coverageData.files.find(({path}) => path === filePath),
	uncoveredLines = fileCoverage.lines.filter(({count}) => count === 0).map(({line}) => line),
	uncoveredLineSummary = [];
for (let i = 0; i < uncoveredLines.length;) {
	const start = uncoveredLines[i];
	let j = 1;
	for (; uncoveredLines[i + j] === start + j; j++) {
		//
	}
	if (j > 20) {
		uncoveredLineSummary.push({start, end: start + j - 1});
	}
	i += j;
}
fs.writeFileSync(
	path.join('coverage', 'uncovered-lines.txt'),
	uncoveredLineSummary.map(({start, end}) => `${start}-${end}`).join('\n'),
);
updateBadge();
