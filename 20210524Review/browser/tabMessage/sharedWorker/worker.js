/**
 * Created with JavaScript.
 * User: RGXMG
 * Email: rickgrimes9229@gmail.com/759237309@qq.com
 * Date: 2021/5/31
 * Time: 22:48
 *
 */
// worker.js
// 储存所有连接的port
let portPool = [];
// 监听接入的port
self.onconnect = function(e) {
  const port = e.ports[0];
  // 保存接入的port
  portPool.push(port);
  // port发送的消息
  port.onmessage = function(e) {
    // 判断连接断开，移除断开的port
    if (e.data === "TO BE CLOSED") {
      const index = portPool.findIndex(p => p === port);
      portPool.splice(index, 1);
    }
    // 通知除当前port之外的所有port
    broadcast(e.data, port);
  };
};

function broadcast(message, selfPort) {
  portPool.forEach(port => {
    port !== selfPort && port.postMessage(message);
  });
}
