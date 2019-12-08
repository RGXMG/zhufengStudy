/**
 * nodejs时单线程、所以不适合CPU密集型，因为在CPU执行大量计算时，nodejs剩下的处理只能等待
 * 但是可以通过child_process模块多开进程来解决，在子进程中可以执行非node程序以及shell命令等等，
 * 执行完之后，以流或者回调的形式返回
 */
// spawn 单词意思为产卵，也就是开启一个子进程
const { spawn } = require('child_process');
const path =  require('path');
// arguments：
// 1. command 执行的命令, 必须制定
// 2. args 命令带的参数，数组，存放了所有运行该命令需要的参数
// 3. options 选项
//   1. cwd 子进程的工作目录
//   2. env环境变量
//   3. detached 如果为true，则该子进程为一个进程组的领头进程，当父进程不存在时也可以独立存在
//   4. stdio 设置标准输入、标准输出、标准错误输出、所有该参数可以为是一个数组，
//      默认情况下这个值和子进程的process的三个值一样，
const p1 = spawn('node', ['1.childProcess1.js'], {
  // cwd: path.join(__dirname, '../'),
  // 设置子进程的标准输入输出错误输出
  // stdio: [process.stdin, process.stdout, process.stderr]
  stdio: ['ipc', process.stdout, 'ignore']
});
p1.on('message', function (msg) {
console.log('main:', msg);
});
p1.send('msg');
p1.on('close', function () {
  console.log('子进程1关闭');
});
p1.on('exit', function () {
  console.log('子进程1退出');
});
p1.on('error', function (e) {
  console.log('子进程1出错', e);
});