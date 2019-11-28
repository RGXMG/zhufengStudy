const net = require('net');

// 创建一个聊天服务器支持如下功能，通过输入对应的标识判断不同的功能
// 实现广播、b:内容
// 私聊、c:对方的用户名:内容
// 列出在线用户列表、l 表示列出所有的用户列表
// 修改昵称 n:新名称
// 保存所有的客户端
const clients = {};
const server = net.createServer(function (socket) {
  console.log(socket.address());
  socket.setEncoding('utf8');
  // 创建唯一的key值
  const key = socket.remoteAddress + socket.remotePort;
  clients[key] = {
    nickname: '匿名',
    socket
  };
  server.getConnections(function (err, count) {
    socket.write('欢迎光临，当前在线人数为' + count + '\r\n')
  });
  socket.on('data', function (data) {
    let nd = data.replace('\r\n', '').slice();
    // 获取指令
    const type = nd.slice(0,1);
    // 去除冒号
    nd = nd.slice(2);
    switch (type) {
      case 'b':
        broadcast(nd);
        break;
      case 'c':
        const temp = nd.split(':');
        sendToUser(temp[0], temp[1]);
        break;
      case 'l':
        showList();
        break;
      case 'n':
        changeNickname(nd);
        break;
      default:
        socket.write('此命令不能识别，请重新输入\r\n');
    }
  });
  socket.on('end', function () {
    socket.destroy();
    delete clients[key];
  });
  function changeNickname(nName) {
    let userObj = null;
    for (const k of Object.keys(clients)) {
      const temp = clients[k];
      if (k === key) {
        userObj = temp;
      }
      if (temp.nickname === nName) {
        userObj = k === key ? '要更改的名称与原名称一样！\r\n' : '名称已经被占用，请换个试试！\r\n';
      }
    }
    if (typeof userObj === 'string') {
      socket.write(userObj);
    } else {
      userObj.nickname = nName;
      socket.write('名称修改成功，您的新昵称为：' + userObj.nickname + '\r\n');
    }
  }
  function showList() {
    let list = Object.keys(clients).map(k => clients[k].nickname + '\r\n');
    socket.write(list.toString());
  }
  function sendToUser(name, text) {
    const targetUser = clients[Object.keys(clients).filter(k => clients[k].nickname === name)[0]];
    if (targetUser) {
      targetUser.socket.write(targetUser.nickname + ':' + text + '\r\n');
    } else {
      socket.write('用户名不存在，或者已经下线' + '\r\n');
    }
  }
  function broadcast(text) {
    for (const user in clients) {
      if (clients.hasOwnProperty(user) && key !== user) {
        clients[user].socket.write(text + '\r\n');
      }
    }
  }
});
server.listen(8080);