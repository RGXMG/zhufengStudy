/**
 * tapable
 * 分为sync和async
 * 跟events的EventEmitter很相似，注册监听
 */
const { SyncWaterfallHook } = require('tapable');

// NOTE Sync类钩子 - SyncWaterfallHook 串行执行，
// NOTE 会将处理函数的执行结果传给下一个处理函数,
// NOTE 如果一个处理函数没有返回值，则将当前处理函数的参数直接传入给下一个处理函数
// NOTE 在call时候传入参数传递给第一个处理函数
// 注册到该钩子下的插件执行顺序都是顺序执行
// 使用tap注册，不能使用tapPromise和tapAsync注册
// 注册一个SyncHook事件，并且定义接受的参数
const queue = new SyncWaterfallHook(['name']);
// 监听该事件，处理函数的个数为注册事件时参数个数 { '0': 'lpl', '1': undefined }
queue.tap('1', function(name) {
  console.log(1, name, arguments); // arguments为
  return name + '1'
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
