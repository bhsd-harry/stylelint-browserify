const chainable = {
	use() {
		return this;
	},
	process() {
		return this;
	},
	then() {
		//
	},
};

export default () => chainable;
