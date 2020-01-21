/**
 * 创建一个style标签，并将其插入到html中
 * @param source
 */
module.exports = function(source) {
  const script = `
    var style = document.createElement('style');
    style.innerText = ${JSON.stringify(source)};
    document.head.append(style);
  `;
  return script;
};
