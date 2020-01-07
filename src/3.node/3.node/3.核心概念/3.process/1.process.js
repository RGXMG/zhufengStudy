/**
 * process.memoryUsage()
 * 内存使用信息
 * {
 * rss: 18415616, 总的内存使用量、包括指令区和堆栈
 * heapTotal: 4210688, 堆占用的内存、包括用到的和没有用到的
 * heapUsed: 2071968, 用到的堆的部分
 * external: 672807 V8引擎内部的C++对象占用的内存、例如Buffer使用的部分
 * }
 */
// const buffers = Buffer.alloc(1024 * 1024 * 1024);
console.log(process.memoryUsage());

/**
 * 常用方法
 */
// 1. process.nextTick：将一个函数推入当前宏任务的微任务对立之中、
// 保证函数能够在同步代码执行完成之后或者下一个回调函数触发之前调用
process.nextTick(() => {
  console.log('nextTick');
});
setTimeout(() => {
  console.log('setTimeout');
});
console.log('sync');

// 2. chdir 用于改变nodejs工作的目录
console.log(process.cwd());
process.chdir('../');
console.log(process.cwd());

// 3. exit 退出当前nodejs应用程序的进程
// process.exit();

// 4. process.kill(pid, [signal])
// 5. process.uptime() 返回当前程序运行的时间
// 6. process.hrtime() 测试一个代码段运行时间，返回俩个时间，第一个是毫秒、第二个是纳秒
const time = process.hrtime();
// 得出俩个时间差
console.log(process.hrtime(time));

// 7. exit事件，process.on('exit', func); 用于处理nodejs应用程序退出触发的进程对象的exit事件。
process.on('exit', function () {
  console.log('exit')
});

//8. uncaughtException事件，process.on('uncaughtException', func); 当程序中抛出一个未被捕获的异常时触发该事件
// 但是一般不会使用、有可能会引起内存泄漏
process.on('uncaughtException', function (e) {
  console.log('uncaughtException', e);
});
setTimeout(() => {
  // 会触发错误
  mego();
}, 3000);