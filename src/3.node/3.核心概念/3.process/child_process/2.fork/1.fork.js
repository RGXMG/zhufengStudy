/**
 * fork 开启一个新的node进程
 * fork时候，默认父子进程是共享标准输入输出的
 * 如果是指silent: true则是不会共享
 */
const { fork } = require('child_process');

const child1 = fork('1.nodeM.js', ['zfpx'], {
  silent: true
});
child1.on('message', function (data) {
  console.log(data);
});
child1.send('msg-msg');