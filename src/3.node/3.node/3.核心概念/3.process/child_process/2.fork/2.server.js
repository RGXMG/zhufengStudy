const http = require('http');

process.on('message', function (msg, server) {
  console.log(msg);
  if (~msg.indexOf('server')) {
    const httpServer = http.createServer(function (req,res) {
      res.setHeader('Content-Type', 'text/html;charset=utf8');
      res.end('请求被' +msg+ '进程处理');
      // listen中放置创建的服务器实例
    }).listen(server);
  }
});
