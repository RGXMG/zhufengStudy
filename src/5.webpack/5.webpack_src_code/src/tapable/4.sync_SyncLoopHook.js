/**
 * tapable
 * 分为sync和async
 * 跟events的EventEmitter很相似，注册监听
 */
const { SyncLoopHook } = require('tapable');

// NOTE Sync类钩子 - SyncLoopHook 串行执行，循环执行处理函数，仅当处理函数返回undefined时停止循环,如果存在多个监听，则必须每个函数都返回undefined时才会结束循环
// 注册到该钩子下的插件执行顺序都是顺序执行
// 使用tap注册，不能使用tapPromise和tapAsync注册
// 注册一个SyncHook事件，并且定义接受的参数
const queue = new SyncLoopHook(['name']);
// 监听该事件，处理函数的个数为注册事件时参数个数 { '0': 'lpl', '1': undefined }
let count = 0;
queue.tap('1', function(name) {
  count += 1;
  console.log(1, name, arguments); // arguments为
  if (count > 5) {
    console.log(1, 'DONE');
    return;
  }
  return true;
});
queue.tap('2', function(name) {
  console.log(2, name, arguments); // arguments为
  return 1;
});
// call表示触发该事件，然后传入参数
// 注意，只能传入事件定义的参数个数，多的会自动忽略
queue.call('lpl');
