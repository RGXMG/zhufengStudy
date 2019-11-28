const dgram = require('dgram');
const socket = dgram.createSocket('udp4');
// 向对方发送消息
let buf = Buffer.from('你好，我是UDP');
socket.send(buf, 41234, 'localhost', function () {
  console.log(arguments);
});
socket.on('message', function (msg, rinfo) {
  console.log(msg.toString());
});