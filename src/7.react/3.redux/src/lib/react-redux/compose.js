const compose = (...fns) => {
  const fn = Array.prototype.reduce.call(fns, (a, b) => (...args) =>
    a(b(...args))
  );
  return suffix => {
    if (!fns.length) return suffix;
    if (fns.length === 1) return fns[0](suffix);
    return fn(suffix);
  };
};
function add1(str) {
  console.log(1);
  return "1" + str;
}
function add2(str) {
  console.log(2);
  return "2" + str;
}
function add3(str) {
  console.log(3);
  return "3" + str;
}
function add4(str) {
  console.log(4);
  return "4" + str;
}
console.log(
  compose(
    add1,
    add2,
    add3,
    add4
  )("xmg")
);
