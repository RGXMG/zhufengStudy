/**
 * 书写babel插件，进行打包预计算
 * 如：const a = 30 * 10;
 * 打包的时候则变成 const a = 300
 */
// const code = 'const result = 30 * 10;';
const code = 'const result = 30 * 10 * 10 * 10 * 10;';
const babel = require('@babel/core');
const types = require('@babel/types');

// 访问者
// 预计算表达式
const visitor = {
  BinaryExpression(path) {
    const { node } = path;
    if (node.left.type === 'NumericLiteral' && node.right.type === 'NumericLiteral') {
      const { left: { value: vL }, right: { value: vR }, operator } = node;
      const count = eval(`${vL}${operator}${vR}`);
      path.replaceWith(types.numericLiteral(count));
      // 递归计算，如果父path也是一个BinaryExpression
      if (path.parentPath.node.type === 'BinaryExpression') {
        visitor.BinaryExpression.call(null, path.parentPath);
      }
    }
  }
};
const r = babel.transform(code, {
  plugins: [
    {visitor}
  ]
});
console.log(r.code);
