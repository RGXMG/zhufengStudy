/**
 * Created with JavaScript.
 * User: RGXMG
 * Email: rickgrimes9229@gmail.com/759237309@qq.com
 * Date: 2021/5/31
 * Time: 22:48
 *
 */
// worker.js
const portPool = [];
self.onconnect = function(e) {
  var port = e.ports[0];
  portPool.push(port);
  console.log("port:::", port);
  port.onmessage = function(e) {
    console.log(e);
    if (e.data === "TO BE CLOSED") {
      const index = ports.findIndex(p => p === port);
      portPool.splice(index, 1);
    }
    var workerResult = "Result: " + e.data[0] * e.data[1];
    boardcast(workerResult);
    // port.postMessage(workerResult);
  };
};

function boardcast(message) {
  portPool.forEach(port => {
    port.postMessage(message);
  });
}
