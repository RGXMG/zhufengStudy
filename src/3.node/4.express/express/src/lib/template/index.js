const fs = require('fs');
const render =  function (filepath, options, callback) {
  fs.readFile(filepath, 'utf8', function (err, str) {
    const head = "with(options) {\n let tpl = '';\ntpl += `";
    let withBody = str.replace(/<%=([\s\S]+?)%>/g, function () {
      return "${" + arguments[1] + "}";
    });
    withBody = withBody.replace(/<%([\s\S]+?)%>/g, function () {
      return "`;\n" + arguments[1] + "\ntpl += `";
    });
    // 替换变量
    const tail = "`;\nreturn tpl;}";
    let html = head + withBody + tail;
    const fn = new Function('options', html);
    callback(null, fn(options));
  });
};
module.exports = render;