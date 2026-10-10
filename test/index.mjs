const rule = {
	messages: new Proxy({}, {
		get() {
			return () => {};
		},
	}),
};

export default rule;
