// 创建一个服务器
const config = require('./config');
const http = require('http');
const chalk = require('chalk');
const debug = require('debug');
class Server {
  constructor() {}
  start() {
    const server = http.createServer();
    // 强制绑定request的this
    // 避免request的this被篡改
    server.on('request', this.request.bind(this));
    server.listen(config.port, () => {
      console.log(`server started at ${chalk.green(config.host + ':' + config.port)}`);
    });
  }
  async request() {}
}
const server = new Server();
server.start();