const defaultRE = /{{((?:.|\r?\n)+?)}}/g;
function getValue(vm, expr) {
  const keys = expr.split(".");
  let v = vm;
  while (keys.length) {
    v = v[keys.shift()];
  }
  return v;
}
function compilerText(node, vm) {
  if (!node.expr) {
    node.expr = node.textContent;
  }
  node.textContent = node.expr.replace(defaultRE, function(...args) {
    return getValue(vm, args[1]);
  });
}
export { getValue, compilerText };
