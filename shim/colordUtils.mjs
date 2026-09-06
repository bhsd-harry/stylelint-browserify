import {colord, extend} from 'colord';
import namesPlugin from 'colord/plugins/names';
import hwbPlugin from 'colord/plugins/hwb';
import labPlugin from 'colord/plugins/lab';
import lchPlugin from 'colord/plugins/lch';

extend([namesPlugin, hwbPlugin, labPlugin, lchPlugin]); // eslint-disable-line unicorn/no-top-level-side-effects

export {colord};
