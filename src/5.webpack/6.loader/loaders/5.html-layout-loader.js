const fs = require('fs');
const loaderUtils = require('loader-utils');
const defaultOptions = {
  placeholder: '{{__content__}}',
  decorator: 'layout',
  include: 'include'
};
module.exports = function (source) {
  const callback = this.async();
  // 获取options
  const options = { ...defaultOptions, ...loaderUtils.getOptions(this) };
  // 正则匹配， 将layout中的路径匹配出来
  const dorRegx = new RegExp(`@${options.decorator}\\((.+)\\)`);
  const includeRegx = new RegExp(`@${options.include}\\(([^)]+)\\)`, 'gm');
  /**
   * reader 读取数据
   * @param path
   * @param sync
   * @returns {Promise<unknown>}
   */
  const reader = (path) => {
    return new Promise((res, rej) => {
      this.resolve(this.context, path, (err, url) => {
        fs.readFile(url, 'utf8', (err, content) => err ? rej(err) : res(content));
      });
    });
  };
  const dorMatch = dorRegx.exec(source);
  /**
   * 处理layout以及include
   */
  reader(dorMatch[1]).then(content => content.replace(options.placeholder, source.replace(dorMatch[0], ''))).then(content => new Promise(async res => {
    let d = null;
    while ((d = includeRegx.exec(content)) !== null) {
      const input = d['input'];
      const index = d['index'];
      const len = d[0].length;
      const preStr = input.slice(0, index);
      const lastStr = input.slice(len + index);
      const repContent = await reader(d[1]);
      content = preStr + repContent + lastStr;
    }
    res(content);
  })).then((content) => {
    callback(null, `module.exports = ${JSON.stringify(content)}`);
  });
};