const http = require('http');
const url = require('url');
const router = [{
  // 路由匹配路径
  path: '*',
  // 路由匹配方法
  method: '*',
  handler(req, res) {
    res.end(`Cannot ${req.method}${req.url}`);
  }
}];
function createApplication() {
  return {
    get(path, handler) {
      router.unshift({
        path,
        handler,
        method: 'get'
      });
    },
    listen(port) {
      const server = http.createServer(function (req, res) {
        const { pathname } = url.parse(req.url, true);
        for (const route of router) {
          if ((route.path === pathname && route.method === req.method.toLowerCase())
            || route.path === '*') {
            route.handler(req, res);
            return;
          }
        }
      });
      server.listen(port);
    }
  };
}
module.exports = createApplication;