/**
 * loader执行函数中的this会被webpack置为context
 * context中可以访问当前处理的文件的信息
 * @param source
 * @returns {*}
 */
const path = require('path');
module.exports = function(source) {
  console.log('log-loader::');

  // NOTE 1. 俩种写法等效，不可以用callback实现异步
  // this.callback(null, source, sourceMap?: SourceMap，用于把装换后的内容得出原内容的Source Map，方便调试, abstractSyntaxTree?: ast，可以将ast语法树传递给后面的loader，实现ast的复用，提升性能);
  // return source;

  // NOTE 2. 想要实现异步要通过this.async()方法返回的函数去执行
  // const asyncCallback = this.async();
  // setTimeout(() => {
  //   asyncCallback(null, source);
  // }, 2000)

  return source;
};
