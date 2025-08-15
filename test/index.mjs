// import path from 'path';

export default {
	messages: new Proxy({}, {
		get() {
			return () => {};
		},
	}),
};
