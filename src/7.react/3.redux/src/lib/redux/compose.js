/**
 * NOTE compose函数，可以将多个函数组合执行，原理更koa一样
 *  在reduce每次累加的时候，都会将传入函数倒叙执行，然后再次执行时就是执行的第一个函数，
 *  而此时第一次函数拿到的是下一次函数，以此类推，eg：
 *  执行compose(a,b,c) -> 得到 (arg) => a(b(c(arg))) 传入一个参数执行之后，该参数会被c函数接收到，
 *  b函数就会接收到 c函数 的返回值next函数，b函数执行后，a函数 也会就会接收到 b函数 的返回值next函数，
 *  当a函数执行完成之后，如果a函数还是返回一个函数，则可以继续传入一个参数，之后，
 *  该参数就会被 a函数 返回的函数接收到，然后在a函数内部调用next函数时，实际上就是调用的之前b函数返回的next函数，同理，b函数调用next时调用的
 *  实际上是之前c函数返回的next函数。
 * @param fns
 * @returns {Function}
 */
const compose = fns => {
  const fn = Array.prototype.reduce.call(fns, (a, b) => (...args) =>
    a(b(...args))
  );
  return suffix => {
    if (!fns.length) return suffix;
    if (fns.length === 1) return fns[0](suffix);
    return fn(suffix);
  };
};

export default compose;
/**
 * NOTE 调试compose函数使用
 */
// function compose (...fns) {
//   const fn = Array.prototype.reduce.call(fns, (a, b) => {
//     console.log("a:::", a.toString());
//     console.log("b:::", b.toString());
//     return (...args) => {
//       return a(b(...args))
//     };
//   });
//   return suffix => {
//     if (!fns.length) return suffix;
//     if (fns.length === 1) return fns[0](suffix);
//     return fn(suffix);
//   };
// };
// var logger1 = dispatch => action => {
//   console.log("旧值1：：：", 1);
//   dispatch(action);
//   console.log("新值1：：：", 1);
// };
// var logger2 = dispatch => action => {
//   console.log("旧值2：：：", 1);
//   dispatch(action);
//   console.log("新值2：：：", 1);
// };
// var logger3 = dispatch => action => {
//   console.log("旧值3：：：", 1);
//   // dispatch(action);
//   console.log("新值3：：：", 1);
// };
// console.log(
//   compose(
//     logger1,
//     logger2,
//     logger3
//   )("xmg")()
// );
