//babel核心库，用来实现核心的转换引擎，自身不包含任何转换，都是依靠plugin是实现转换
const babel = require('@babel/core');
// 可以实现类型判断，生成AST节点
const types = require('@babel/types');

const code = 'const sum = (a,b) => a + b';

// 访问者的设计模式，它可以对特定的AST节点进行处理
const visitor = {
  // 如果只需要处理一次，则直接传入函数
  // 反之如果想要在enter和leave的时候都处理则传入一个对象{enter(){},leave(){}}
  ArrowFunctionExpression(path) {
    // console.log(path.parent.id.name, path);
    const { node: { params },parent:{ id } } = path;
    const body = types.blockStatement([types.returnStatement(path.node.body)]);
    // console.log(name, params);
   const functionNode = types.functionExpression(id, params, body, false, false);
    path.replaceWith(functionNode);
  }
};
const arrowPlugin = { visitor };
// babel会首先将code转为ast
// 然后遍历，去匹配插件的visitor对象去处理
const result = babel.transform(code, {
  plugins: [
    arrowPlugin
  ]
});
console.log(result.code);


