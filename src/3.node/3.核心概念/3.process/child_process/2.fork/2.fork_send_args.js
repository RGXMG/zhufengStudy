/**
 * send方法其实可以有俩个参数，
 * 第一个参数是任意类型，第二个只能是http server/net server socket/server
 * 如果发送server，子线程进行监听该server，
 * 当客户端访问时，系统就会判断哪个线程空闲，就会把请求交个该线程处理
 * 一个服务器能创建多少个进程(根据cpu的核心数判断)，可以通过os模块进行判断
 */
const { fork } = require('child_process');
const http = require('http');
const os = require('os');

const httpServer = http.createServer(function (req,res) {
  res.setHeader('Content-Type', 'text/html;charset=utf8');
  res.end('请求被parent进程处理');
}).listen(8080);
/**
 * 根据cpu的核数的个数进行判断能够创建多少个子进程
 */
for (let i = 0; i < os.cpus().length; i ++) {
  const child = fork('./2.server.js', [], {
    cwd: __dirname
  });
  child.send('server' + i, httpServer);
}