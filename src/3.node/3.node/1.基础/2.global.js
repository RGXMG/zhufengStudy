/**
 * global 全局对象
 * windows里也有全局对象，只是不能直接访问
 * 浏览器中的全局对象为window对象
 * 以下为常见的全局变量：
 * console
 * process：chdir，cwd
 * nextTick
 * stdout stderr stdin
 * Buffer
 * clearImmediate clearInterval clearTimeout
 * setImmediate setInterval setTimeout
**/

// NOTE 1.process对象,表示当前进程
// pwd: current work directory 当前工作目录
// console.log(process.cwd());
// 输出：H:\web\study\前端\珠峰建构课2018\projectSrcCode\src\3.node

// chdir: change directory 改变当前工作目录
// console.log(process.chdir('../'));
// 切换为上级目录
// console.log(process.cwd());
// 输出：H:\web\study\前端\珠峰建构课2018\projectSrcCode\src

// memoryUsage: 内存使用情况
// console.log(process.memoryUsage());
/**
 * rss: 17874944, : 常驻内存
   heapTotal: 5533696, ： 堆内存的总申请量
   heapUsed: 2593872, ： 已经使用的量
   external: 767343 ： 外部内存的使用量 v8引擎最多使用1.8G内存
 }
 */

// NOTE 2.nextTick 把回调函数放在当前执行栈的底部
// setImmediate： 把回调函数放在事件队列的底部
// 在nextTick与setImmediate，总是先执行nextTick, 也就是先执行当前执行栈。
// 在node规范中，推荐使用setImmediate。避免当前执行栈出现阻塞和死循环
// 而setTimeout和setImmediate的执行顺序是不固定的
setTimeout(function() {
  console.log('setTimeout');
});
setImmediate(function() {
  console.log('setImmediate');
});
