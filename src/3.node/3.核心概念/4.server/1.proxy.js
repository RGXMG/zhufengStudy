/**
 * 代理服务器
 * 正向代理：帮助或者代理局域网内的用户访问外网
 * 反向代理：帮助或者代理代理服务器自身局域网之外的用户访问局域网
 * 作用：
 * 1. 安全：监控访问内容，设定访问权限
 */

const proxy = require('http-proxy');
const http = require('http');
const proxyServer = proxy.createProxyServer();
http.createServer(function (req,res) {
  proxyServer.web(req, res, {
    target: 'http://localhost:9000'
  });
}).listen(8000);