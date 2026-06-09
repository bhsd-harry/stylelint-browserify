export default fix =>
	[true, 'true', '', 'strict', 'lax'].includes(fix) ? 'strict' : undefined;
