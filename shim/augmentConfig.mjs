// eslint-disable-next-line n/no-missing-import
import normalizeAllRuleSettings from 'stylelint/lib/normalizeAllRuleSettings';

const addOptions = (stylelint, config) => {
	const augmentedConfig = {...config};
	const subset = [
		'fix',
		'computeEditInfo',
		'ignoreDisables',
		'quiet',
		'validate',
	];
	for (const key of subset) {
		const value = stylelint._options[key]; // eslint-disable-line no-underscore-dangle
		if (value) {
			augmentedConfig[key] = key === 'fix' || value;
		}
	}
	return augmentedConfig;
};

export const augmentConfigExtended = () => {};

export const augmentConfigFull = async (stylelint, _, {config}) => ({
	config: await normalizeAllRuleSettings(addOptions(stylelint, config)),
});
