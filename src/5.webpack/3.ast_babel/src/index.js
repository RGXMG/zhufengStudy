// 将源码转为ast
const esprima = require('esprima');
// 便利更新ast 洋葱模型
const estraverse = require('estraverse');
// 将ast重新生成源码
const escodegen = require('escodegen');
let code = 'function ast(){}';
let ast = esprima.parse(code);
estraverse.traverse(ast, {
  enter(node) {
    if (node.type === 'Identifier') {
      node.name += '_enter';
    }
  },
  leave(node) {
    if (node.type === 'Identifier') {
      node.name += '_leave';
    }
  }
});
console.log(escodegen.generate(ast));
