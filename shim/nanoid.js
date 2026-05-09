const urlAlphabet = 'useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict';

const nanoid = size => {
	let id = '',
		i = size;
	while (i--) {
		id += urlAlphabet[Math.random() * 64 | 0]; // eslint-disable-line no-bitwise
	}
	return id;
};

module.exports = {nanoid};
