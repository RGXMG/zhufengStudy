const net = require('net');
const fs = require('fs');
const path = require('path');

const ws = fs.createWriteStream(path.join(__dirname, 'msg.txt'), { encoding: 'utf8' });
const netServer = net.createServer();
// socket为双工流
netServer.on('connection', function(socket) {
  // socket.pause(), 将流暂定，持续接受多个输入到缓存
  socket.pause();

  // 通过setTimeout处理用户输入
  // 延迟一次性输入，
  // 缺点也很明显，必须和只能等待一段特定时间，无论用户是否提前结束输入或者一直未结束输入，
  // 都会一股脑的输入，然后用户输入一下，就会写入一下
  // setTimeout(() => {
    // 默认情况下，当可读流读到数据末尾的时候就会自动关闭流
    // 如果关闭情况下，再去尝试写入就会报 write after end错误
    // 在options中加上end:false就可以不关闭流
    // socket.pipe(ws, { end:false });
  // }, 10000);

  // 通过设置超时时间处理用户输入
  // 当用户一直在输入时，会存在数据接收连接，
  // 但是当用户不输入的时候超过这个时间，就说明用户停止输入
  // 这个时候就可以一次性写入用户输入的数据
  socket.setTimeout(3 * 1000);
  socket.on('timeout', function() {
    console.log('pipe 用户输入的内容');
    socket.pipe(ws);
  });
});
netServer.listen(8080);