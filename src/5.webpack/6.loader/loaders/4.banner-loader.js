/**
 * 该loader向js文件中添加一个头部注释
 * 将4.copyright.js文件的数据读取出来写入js文件中
 */
const fs = require('fs');
const path = require('path');
const loaderUtils = require('loader-utils');
module.exports = function (source) {
  const callback = this.async();
  const options = loaderUtils.getOptions(this);
  this.resolve(this.rootContext, options.copyright, (err, url) => {
    fs.readFile(url, 'utf8', (err, content) => {
      const s = '\r\n' + content + '\r\n' + source;
      console.log(s);
      callback(err, s);
    });
  });
};
