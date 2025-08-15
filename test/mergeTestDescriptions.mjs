export default ({accept = [], reject = []}, tests) => ({
	...tests,
	accept: [...accept, ...tests.accept ?? []],
	reject: [...reject, ...tests.reject ?? []],
});
