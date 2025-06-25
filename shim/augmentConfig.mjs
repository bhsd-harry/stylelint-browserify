// eslint-disable-next-line n/no-missing-import
import normalizeAllRuleSettings from 'stylelint/lib/normalizeAllRuleSettings';

const addOptions = (stylelint, config) => {
	const augmentedConfig = {...config};
	const subset = [
		'customSyntax',
		'fix',
		'computeEditInfo',
		'ignoreDisables',
		'quiet',
		'reportDescriptionlessDisables',
		'reportInvalidScopeDisables',
		'reportNeedlessDisables',
		'reportUnscopedDisables',
		'validate',
	];
	const options = {
		...stylelint._options, // eslint-disable-line no-underscore-dangle
		fix: Boolean(stylelint._options.fix), // eslint-disable-line no-underscore-dangle
	};
	for (const key of subset) {
		const value = options[key];
		if (value) {
			augmentedConfig[key] = value;
		}
	}
	return augmentedConfig;
};

export const augmentConfigExtended = () => {};

export const augmentConfigFull = async (stylelint, _, cosmiconfigResult) => {
	const {config} = cosmiconfigResult;
	let augmentedConfig = addOptions(stylelint, config);
	augmentedConfig = await normalizeAllRuleSettings(augmentedConfig);
	return {
		config: augmentedConfig,
	};
};
