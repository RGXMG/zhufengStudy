/**
 * tapable
 * 分为sync和async
 * 跟events的EventEmitter很相似，注册监听
 */
// const { AsyncSeriesHook } = require('tapable');

// NOTE 模拟实现
class AsyncSeriesHook {
  constructor(arg) {
    this.arguments = arg;
    this.handlers = [];
  }
  tapAsync(opt, handler) {
    this.handlers.push(handler);
  }
  callAsync() {
    const args = [...arguments];
    const thenable = args.pop();
    const inArgs = args.splice(0, this.arguments.length);
    const handlerLen = this.handlers.length - 1;
    let index = 0;
    const next = () => {
      if (index > handlerLen) {
        return thenable();
      }
      this.handlers[index ++](...inArgs, next);
    };
    next();
  }
}

// NOTE Async类钩子 - AsyncSeriesHook 异步串行执行，提供cb函数，一个处理函数执行完成才会执行下一个处理函数
// 异步串行执行
const queue = new AsyncSeriesHook(['name']);

// tapAsync注册方式 并行执行，通过调用cb通知完成
queue.tapAsync('1', function(name, cb) {
  setTimeout(() => {
    console.log(1, name);
    cb();
  }, 1000);
});
queue.tapAsync('2', function(name, cb) {
  setTimeout(() => {
    console.log(2, name);
    cb();
  }, 2000);
});
queue.tapAsync('3', function(name, cb) {
  setTimeout(() => {
    console.log(3, name);
    cb();
  }, 3000);
});

console.time('async');
queue.callAsync('lpl', () => {
  console.timeEnd('async');
  console.log(123);
});
