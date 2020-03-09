// const array = [
//   [3,2,1,3,21],
//   [3,21,32,1,321],
//   [1,2,3,4,5],
//   [2,1,3,41,2],
//   [1,1,32,3,1]
// ];
// // 得出array中子元素最长的长度
// const maxLen = Math.max(...array.reduce((pre, next) => { pre.push(next.length); return pre; }, []));
// [...Array(maxLen).keys()].reduce((pre, next, index) => {
//   const vOfArray = [array[0][index]];
// }, []);

// const qs = require('qs');
// const querystring = require('querystring');
// const obj = { zx: { name: 1, age: 3 }, ji: { name: 3, age: 1 } };
// const a = qs.stringify(obj);
// console.log(a, qs.parse(a));
// const b = querystring.stringify(obj);
// console.log(b);

// const contentType = require('content-type');
// const str = 'text/plain;charset=gbk';
// const typeStr = contentType.parse(str);
// console.log(typeStr, typeStr.parameters.charset);
const path = require("path");
// console.log(path.dirname('./src/index.js'));

const cwd = process.cwd();
const a = "./src/index.js";
const b = "./b.js";

// 加载路径：
const loadPath = a => path.join(cwd, a);
const relative = (a, b) => path.relative(a, b);

// console.log(loadPath(a));
// console.log(loadPath(b));
// console.log(path.join('./', 'src', './b.js'));
// console.log(relative(cwd, './src/main/index.js'));
// console.log(loadPath('./src/main/index.js'));
// [^/]+(?!.*\/)
console.log(path.dirname(path.join('./src/main', './b.js')));
console.log('./src/main/index.js'.replace(/\/[^/]+(?!.+)/g, ''));