const babel = require("@babel/core");
const types = require("@babel/types");

/**
 * NOTE 如果想要向其他plugin一样的书写格式，
 * 则需要早node_modules下新建一个文件夹：babel-plugin-exact
 * 然后再babel的配置中写入
 *
 * NOTE 也可以直接require导入
 * plugin: [
 *    [
 *      "exact" // 去掉babel-plugin-之后的名称
 *      // 配置任意参数
 *      // 然后在visitor的第一个参数{ re: { opts } }中的opts中获取
 *      {
 *        "libraryName": "lodash"
 *      }
 *    ]
 * ]
 */
const visitor = {
  ImportDeclaration(path) {
    const {
      node: { source, specifiers }
    } = path;
    if (!types.isImportSpecifier(specifiers[0])) return;
    const stringLiteralValue = source.value;
    const newImportDeclaration = specifiers.map(specifier => {
      const { local } = specifier;
      return types.importDeclaration(
        [types.importDefaultSpecifier(local)],
        types.stringLiteral(`${stringLiteralValue}/${local.name}`)
      );
    });
    path.replaceWithMultiple(newImportDeclaration);
  }
};
const code = 'import { flatten, cloneDeep, join } from "lodash"';
const res = babel.transform(code, {
  plugins: [{ visitor }]
});
console.log(res.code);
