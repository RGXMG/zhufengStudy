const path = require('path');
module.exports = {
  // 监听的主机
  host:'localhost',
  // 端口号
  port: '8080',
  // 根目录
  root: path.resolve(__dirname, '..', 'public')
};