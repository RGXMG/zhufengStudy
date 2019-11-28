const dgram = require('dgram');
/**
 * 创建udp的服务器
 * udp优先：1. 速度快，不需要验证, 2.区别于一般的服务端和客户端，UDP每个端既是客户端也是服务端
 * udp缺点：1. 丢失数据不会重写发送，因为不需要验证
 */
const socket = dgram.createSocket('udp4');
// 发消息
// 收消息 在本机的41234上面的端口进行监听消息
socket.bind(41234, 'localhost');
// 监听对方发送过来的数据
socket.on('message', function (msg, rinfo) {
  console.log(msg.toString()) ;
  socket.send(Buffer.from(msg), 0, msg.length, rinfo.port, rinfo.address);
});