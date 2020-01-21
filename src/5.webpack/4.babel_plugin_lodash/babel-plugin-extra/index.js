const types = require('@babel/types');
const visitor = {
  ImportDeclaration(path, ref = { opts }) {
    const { node: { source, specifiers } } = path;
    const stringLiteralValue = source.value;
    if (ref.opts.libraryName !== stringLiteralValue || !types.isImportSpecifier(specifiers[0])) return;
    const newImportDeclaration = specifiers.map(specifier => {
      const { local } = specifier;
      return types.importDeclaration([types.importDefaultSpecifier(local)], types.stringLiteral(`${stringLiteralValue}/${local.name}`));
    });
    path.replaceWithMultiple(newImportDeclaration);
  }
};
// 必须返回一个function，然后返回visitor对象
module.exports = () => ({visitor});
