/**
 * 生成器 用来生成迭代器
 * @param list
 * @returns {{next(): *}|{value: *, done: boolean}}
 */
function yieldRead(list) {
  // 索引
  let index = 0;
  return {
    next() {
      const done = index === list.length;
      // 如果!!done为true，则返回undefined，否则返回具体的值
      const value = !done ? list[index ++] : undefined;
      return {
        value,
        done,
      };
    }
  };
}
// const it = yieldRead(['1', '2']);
// let res = null;
// do {
//   res = it.next();
//   console.log(res);
// } while (!res.done);

// NOTE -------- es6 写法

/**
 * es6 标准generator函数
 * 1. 函数未执行完 done永远为false， 返回的value为yield后面的语句返回的值
 * 2. 函数执行完之后，done为true，
 *      1): 自定义的return返回值，那么该返回值将加在value中
 *      2): 没有自定义的值，value就位undefined
 * @param list
 * @returns {IterableIterator<*>}
 */
function *es6read(list) {
  for (let i = 0; i < list.length; i ++) {
    yield list[i];
  }
  yield list;
  return  1
}
const it = es6read(['1', '2']);
let res = null;
do {
  res = it.next();
  console.log(res);
} while (!res.done);
