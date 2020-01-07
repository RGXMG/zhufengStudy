/**
 * 利用node创建客户端
 * @type {module:net}
 */
const net  = require('net');
const socket = new net.Socket();
// socket也是一个双工流
// 跟服务端的connection中回调的socket具有一样的方法
socket.connect(8080, 'localhost', function() {
  socket.write('hello');
});
socket.setEncoding('utf8');
socket.on('data', function (data) {
  console.log('接受到来自服务端的信息', data);
});
// 5s之后关闭服务端的连接
setTimeout(() => {
  socket.end();
}, 5000);