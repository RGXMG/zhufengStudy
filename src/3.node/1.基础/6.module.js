/**
 * node 使用 common.js规范
 * @type {number}
 */
// 定义变量
let a = 123;
module.exports = a;

// NOTE 上面的代码会由node转为一个函数
// NOTE 步骤：
//  1.找到这个文件，
//  2. 读取此文件模块的内容,
//  3. 把它封装在一个自执行函数进行执行
// NOTE 当其他模块进行require的时候，拿到的返回值就是return的值
// !function(exports, require, module, __filename, __dirname) {
//   let a = 123;
//   module.exports = a;
//   return module.exports;
// }();


// NOTE 打印module
console.log(module);
// Module {
//   id: '.', // NOTE 模块的ID，以程序执行路径为准，入口模块ID永远为 .
//   path: 'H:\\web\\study\\前端\\珠峰建构课2018\\projectSrcCode\\src\\3.node',
//   exports: 123, // NOTE 模块的导出对象，默认为空对象
//   parent: null, // NOTE 父模块，当前模块被谁加载的
//   filename: 'H:\\web\\study\\前端\\珠峰建构课2018\\projectSrcCode\\src\\3.node\\6.module.js',  // NOTE 当前模块的绝对路径
//   loaded: false, // NOTE 当前同步代码是否加载完成
//   children: [], // NOTE 此模块加载了那些模块
//   paths: [ // NOTE 第三方的查找模块路径
//   'H:\\web\\study\\前端\\珠峰建构课2018\\projectSrcCode\\src\\3.node\\node_modules',
//   'H:\\web\\study\\前端\\珠峰建构课2018\\projectSrcCode\\src\\node_modules',
//   'H:\\web\\study\\前端\\珠峰建构课2018\\projectSrcCode\\node_modules',
//   'H:\\web\\study\\前端\\珠峰建构课2018\\node_modules',
//   'H:\\web\\study\\前端\\node_modules',
//   'H:\\web\\study\\node_modules',
//   'H:\\web\\node_modules',
//   'H:\\node_modules'
// ]
// }


// NOTE 在module.exports未赋值之前 => this === module.exports
console.log(this === module.exports);