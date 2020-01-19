/**
 * tapable
 * 分为sync和async
 * 跟events的EventEmitter很相似，注册监听
 */
const { AsyncParallelHook } = require('tapable');

// NOTE Async类钩子 - AsyncParallelHook 串行执行，循环执行处理函数，仅当处理函数返回undefined时停止循环,如果存在多个监听，则必须每个函数都返回undefined时才会结束循环
// 异步并发执行
// 支持tap注册，tapPromise和tapAsync注册
// 注册一个SyncHook事件，并且定义接受的参数
const queue = new AsyncParallelHook(['name']);

// // tap注册方式 串行执行
// queue.tap('1', function(name) {
//   console.log(1, name, arguments); // arguments为
// });
// queue.tap('2', function(name) {
//   console.log(2, name, arguments); // arguments为
// });

// // tapAsync注册方式 并行执行，通过调用cb通知完成
// queue.tapAsync('1', function(name, cb) {
//   setTimeout(() => {
//     console.log(1, name);
//     cb();
//   }, 1000);
// });
// queue.tapAsync('2', function(name, cb) {
//   setTimeout(() => {
//     console.log(2, name);
//     cb();
//   }, 2000);
// });
// queue.tapAsync('3', function(name, cb) {
//   setTimeout(() => {
//     console.log(3, name);
//     cb();
//   }, 3000);
// });

// console.time('async');
// 如果是异步(tapAsync)，则没有call方法，只有callAsync
// queue.callAsync('lpl', () => {
//   console.timeEnd('async');
//   console.log(123);
// });

// tapPromise注册方式 并行执行，返回promise，调用resolve时该处理函数完成
queue.tapPromise('1', function(name) {
  return new Promise(res => {
    setTimeout(() => {
      console.log(1, name);
      res();
    }, 1000);
  });
});
queue.tapPromise('2', function(name) {
  return new Promise(res => {
    setTimeout(() => {
      console.log(2, name);
      res();
    }, 2000);
  });
});
queue.tapPromise('3', function(name) {
  return new Promise(res => {
    setTimeout(() => {
      console.log(3, name);
      res();
    }, 3000);
  });
});

console.time('promise');
queue.promise('lpl').then(() => {
  console.log('123123');
  console.timeEnd('promise')
});
