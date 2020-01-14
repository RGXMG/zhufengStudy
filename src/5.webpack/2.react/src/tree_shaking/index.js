/**
 * webpack tree-shaking
 * webpack --mode 必须为production
 * https://www.cnblogs.com/tugenhua0707/p/9671618.html#_labe1_2
 */
import { getName } from './utils';
const name = getName();
window.__name__ = name;