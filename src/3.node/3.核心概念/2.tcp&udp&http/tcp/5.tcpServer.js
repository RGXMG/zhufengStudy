/**
 * 简易版本聊天室
 * 1. 可以设置昵称
 * 2. 可以广播
 */
const net = require('net');
// 保存所有的连接
// 用于广播
const clients = {};
const server = net.createServer(function (socket) {
  socket.setEncoding('utf8');
  server.getConnections(function (err, count) {
    socket.write('欢迎光临，当前在线人数为' + count + '请输入你的昵称：\r\n')
  });
  let username;
  socket.on('data', function (data) {
    const ds = data.replace('\r\n', '');
    if (!username) {
      username = ds;
      // 保存
      clients[username] = socket;
      // 向所有的客户端发送消息
      broadcast(username, `欢迎${username}加入聊天室`);
    } else {
      broadcast(username, `${username}：${ds}`);
    }
  });
  socket.on('end', function () {
    broadcast(username, `${username}骂骂咧咧的退出聊天室`);
    delete clients[username];
  });
});
function broadcast(username, msg) {
  for (const name in clients) {
    if (name !== username) {
      clients[name].write(msg + '\r\n');
    }
  }
}
server.listen(8080, function () {
  console.log('TCP聊天室已经启动，信息是', server.address());
});
