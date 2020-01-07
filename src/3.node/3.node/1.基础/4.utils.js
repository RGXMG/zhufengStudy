/**
 * 工具函数
 **/
const utils = require('util');
// NOTE inspect
const obj = { a: 1, home: { is: 'is', b: { lp: 123 } } };
// 指定展示层级
console.log(utils.inspect(obj, { depth: 2 }));

// NOTE 各种类型判断
// isFunction
// isObject
// isUndefined
// ...
