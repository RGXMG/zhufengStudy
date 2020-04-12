/**
 * webpack tree-shaking
 * webpack --mode 必须为production
 * https://www.cnblogs.com/tugenhua0707/p/9671618.html#_labe1_2
 * webpack 4以前在使用babel情况下需要在env下配置modules:false才能使用tree-shaking
 */
import { getName } from "./utils";
console.log(123);
getName();
// const name = getName();
// window.__name__ = name;
