import fs from 'fs';
import path from 'path';
import {updateBadge, findUncoveredBlocks} from '@bhsd/test-util';

findUncoveredBlocks(
	'coverage/coverage.json',
	path.join('coverage', 'uncovered-lines.txt'),
	path.join('build', 'stylelint.js'),
);
updateBadge();
