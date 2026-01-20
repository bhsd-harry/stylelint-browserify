export default fix =>
	fix === true || fix === 'true' || fix === '' || fix === 'strict' || fix === 'lax' ? 'strict' : undefined;
