/**
 * 默认情况下，父进程会等待子进程全部结束后才会退出
 * 但是如果为子进程的options中的detached为true的话，
 * 那么该子进程就可以脱离父进程独立存在
 */
 const { spawn } = require('child_process');
 const fs = require('fs');
 const fd = fs.openSync('./3.msg.txt', 'w');
 const p1 = spawn('node', ['3.childProcess.js'], {
   stdio: ['ignore', fd, 'ignore'],
   detached: true
 });
p1.on('error', function (e) {
  console.log(e);
});
// 让父进程先退出，子进程继续运行
// 如果子进程拥有detached的话，那么子进程不会停止运行
p1.unref();