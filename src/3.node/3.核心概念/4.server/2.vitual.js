/**
 * 弹性计算云服务器 ECS 一个完整的服务器
 * 虚拟主机 你得到的只是此服务上的一个目录
 * 通过headers的host代理设置，访问同一个端口，代理到不同的端口服务器
 */
 const http = require('http');
 const proxyServer = require('http-proxy');
 const config = {
   'x1.com': 'http://localhost:8000',
   'x2.com': 'http://localhost:9000',
 };
 const ps = proxyServer.createProxyServer();
 const server = http.createServer(function(req, res) {
   const host = req.headers['host'];
   const target = config[host];
   if (target) {
     ps.web(req, res, {
       target
     });
   } else {
     res.end('404');
   }
 }).listen(80);