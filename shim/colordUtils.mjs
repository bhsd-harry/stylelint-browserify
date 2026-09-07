import {rgba} from '@bhsd/browser/color';
import {colorsNamed} from 'culori/fn';

const colorsNamedMap = new Map(Object.entries(colorsNamed).map(([key, value]) => [value, key]));

class Colord {
	constructor(color) {
		this.rgb = rgba(color);
	}

	isValid() {
		return this.rgb.length === 4;
	}

	toName() {
		if (!this.isValid()) {
			return undefined;
		}
		const [r, g, b, a] = this.rgb;
		if (r === 0 && g === 0 && b === 0 && a === 0) {
			return 'transparent';
		}
		return a === 1 ? colorsNamedMap.get(r * 0x1_00_00 + g * 0x1_00 + b) : undefined;
	}
}

export const colord = color => new Colord(color);
