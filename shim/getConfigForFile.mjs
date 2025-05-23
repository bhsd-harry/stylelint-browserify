import normalize from 'stylelint/lib/normalizeAllRuleSettings'; // eslint-disable-line n/no-missing-import

export default async stylelint => ({
	config: await normalize(stylelint._options.config), // eslint-disable-line no-underscore-dangle
});
