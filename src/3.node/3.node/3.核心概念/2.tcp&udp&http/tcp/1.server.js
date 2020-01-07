const net = require('net');
// socket 为可读流， 其实是一个双工流
// creatServer的回调函数实际上就是connect事件的回调，
// 可以单独提出来，监听connection事件
// 每当一个客户端连接时就会执行
const server = net.createServer({}, function (socket) {
  // 客户端连接的总数量Wie2，多了就不会连接成功
  server.maxConnections = 2;
  console.log(socket.address());
  socket.setEncoding('utf8');
  server.getConnections(function(err, count){
    console.log('总共有'+count+'连接');
  });
  socket.on('data', function(data) {
    console.log('接收到客户端发来的消息：：', data);
    socket.write(data);
  });
  // 客服端开始关闭，触发end事件
  socket.on('end', function(data) {
    console.log('客户端正在关闭');
  });
  // 客户端已经被关闭
  // hasError 表示关闭时是否出错
  socket.on('close', function(hasError) {
    console.log('客户端已关闭');
  });
  socket.on('error', function(error) {
    console.log(error);
  });
});
server.listen(8080, function() {
  console.log(server.address());
  console.log('服务器已经启动');
});
server.on('close', function () {
  console.log('服务器已关闭');
});
server.on('error', function (err) {
  console.log(err);
});
// 5s之后不会再接受新的连接(会被拒绝)，原有的客户端可以继续保持连接使用
// 当原有的客户端全部关闭之后，服务器自动关闭
// setTimeout(() => {
//   server.close();
// }, 5000);

// 5s之后，等待所有的客户端关闭之后，关闭服务器
// setTimeout(() => {
//   server.unref();
// }, 5000);