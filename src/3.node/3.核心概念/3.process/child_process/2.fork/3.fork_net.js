/**
 * 根据不同的条件请求让同的子进程处理
 */
const net = require('net');
const { fork } = require('child_process');

const child = fork('./3.net_server.js', [], {
  cwd: __dirname
});
const server = net.createServer(function (socket) {
  if (Math.random() % 2 === 0) {
    child.send('socket', socket);
  } else {
    let sum = 0;
    for (let i = 0; i < 1000000; i ++) {
      sum += i;
    }
    socket.write('parent' + sum);
  }
}).listen(8080);