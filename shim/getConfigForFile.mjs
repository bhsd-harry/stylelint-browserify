import {augmentConfigFull} from './augmentConfig.mjs';

export default ({stylelint, filePath}) => augmentConfigFull(stylelint, filePath, {
	config: stylelint._options.config, // eslint-disable-line no-underscore-dangle,
});
