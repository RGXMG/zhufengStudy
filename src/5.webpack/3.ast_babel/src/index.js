// 将源码转为ast es噗瑞玛
const esprima = require("esprima");
// 便利更新ast 洋葱模型 es踹窝儿死
const estraverse = require("estraverse");
// 将ast重新生成源码 es扣得跟
const escodegen = require("escodegen");
let code = "function ast(){}";
let ast = esprima.parse(code);
// estraverse.traverse方法时进行遍历
// estraverse.replace是进行替换
estraverse.traverse(ast, {
  enter(node) {
    if (node.type === "Identifier") {
      node.name += "_enter";
    }
  },
  leave(node) {
    if (node.type === "Identifier") {
      node.name += "_leave";
    }
  },
});
console.log(escodegen.generate(ast));
