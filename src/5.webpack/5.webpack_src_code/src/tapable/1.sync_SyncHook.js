/**
 * tapable
 * 分为sync和async
 * 跟events的EventEmitter很相似，注册监听
 */
const { SyncHook, SyncBailHook } = require('tapable');

// NOTE Sync类钩子 - SyncHook 串行执行，不关心返回值
// 注册到该钩子下的插件执行顺序都是顺序执行
// 使用tap注册，不能使用tapPromise和tapAsync注册
// 注册一个SyncHook事件，并且定义接受的参数
const queue = new SyncHook(['name', 'age']);
// 监听该事件，处理函数的个数为注册事件时参数个数 { '0': 'lpl', '1': undefined }
queue.tap('1', function(name) {
  console.log(1, name, arguments);
});
queue.tap('2', function(name) {
  console.log(2, name);
});
queue.tap('3', function(name) {
  console.log(3, name);
});
// call表示触发该事件，然后传入参数
// 注意，只能传入事件定义的参数个数，多的会自动忽略
queue.call('lpl');
