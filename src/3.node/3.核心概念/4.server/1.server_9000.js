const http = require('http');
http.createServer(function (req, res) {
  res.setHeader('Content-Type', 'text/html;charset=utf8');
  res.end('我是9000端口服务器');
}).listen(9000);