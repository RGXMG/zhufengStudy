/**
 * exec为同步方法，执行shell命令，能够缓存子线程执行的结果
 * 执行shell命令，当shell命令输出的内容时，exec将它缓存起来
 * 最后再调用回调函数
 * options:
 * 1. cwd
 * 2. env
 * 3. encoding
 * 4. timeout 超时时间(毫秒)
 * 5. maxBuffer 缓存的最大
 * 6. killSignal 指定关闭子进程的信号，默认值为 'SIGTERM'，
 *    我们可以通过kil命令向子进程 发射信号, 只是发送一种信号，不代表一定就会杀死进程
 */
 const { exec } = require('child_process');
 const child = exec('node ./1.childProcess.js a v c', { timeout: 100 }, function (err, stdout, stderr) {
   console.log(err);
  console.log(stdout);
 });

 child.kill();