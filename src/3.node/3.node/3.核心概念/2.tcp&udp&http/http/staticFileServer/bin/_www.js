// -d --root 静态文件根目录
// -o --host 主机地址
// -p --port 端口号
const yargs = require('yargs');
const Server = require('../src/app');
const args = yargs.option('d', {
  alias: 'root',
  type: 'string',
  demand: false,
  default: process.cwd(),
  description: '静态文件根目录'
}).option('o', {
  alias: 'host',
  type: 'string',
  demand: false,
  default: 'localhost',
  description: '主机地址'
}).option('p', {
  alias: 'port',
  type: 'number',
  demand: false,
  default: 8080,
  description: '端口号'
  // 使用示例
}).example('xmg-ss -d / -p 8080 -d localhost', '在本机的8080端口上监听/目录下的文件')
  // 使用说明
  .usage('xmg-ss [options]').help('h').argv;
const server = new Server(args);
server.start();