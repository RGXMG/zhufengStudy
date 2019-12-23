const http = require('http');
http.createServer(function (req, res) {
  res.setHeader('Content-Type', 'text/html;charset=utf8');
  res.end('我是8000端口服务器');
}).listen(8000);