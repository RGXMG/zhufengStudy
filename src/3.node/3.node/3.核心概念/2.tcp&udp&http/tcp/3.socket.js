// 当客户端访问服务器的时候，会发送一个文件给客户端
const net = require('net');
const rs = require('fs').createReadStream('./3.socket.txt');
// socket 双工流
net.createServer(function (socket) {
  rs.on('data', function (data) {
    // 调用socket.write实际上是将数据发送到客户端
    // 当数据还未发送成功时，另外写入的数据就会缓存到缓存队列中
    // 然后返回一个flag,标识缓存是否满
    const flag = socket.write(data);
    console.log('flag=', flag);
    console.log('缓存的字节数：', socket.bufferSize);
    socket.on('drain', () => {
      console.log('缓存区中的数据已送达');
    });
  });
}).listen(8080);
