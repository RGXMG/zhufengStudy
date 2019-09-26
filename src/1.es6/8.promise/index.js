// NOTE 原生JS promise调用
// const Promise  = require('./promise');
const Promise  = require('./promiseOfStep');
const pro = new Promise((res, rej) => {
  setTimeout(() => {
    res(9);
  }, 2000);
});
pro.then(res => {
  console.log(res);
  throw new Error('');
}).then(() => {}, () => {
  console.log('第1个异常');
  return 5555;
}).then((res) => {console.log(res)});
// 简单实现