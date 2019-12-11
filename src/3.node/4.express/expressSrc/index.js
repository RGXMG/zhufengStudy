const http = require('http');
const url = require('url');
function createApplication() {
  // 保存路由规则
  // 直接使用数组
  const routesArray = [];
  const app = function(req, res) {
    const { pathname } = url.parse(req.url);
    const method = req.method.toLowerCase();
    let index = 0;
    // 是否为中间件
    const isValidMiddleware = (router, pathname) => router.method === 'middleware' && (pathname.startsWith(router.path + '/') || pathname === router.path || router.path === '/');
    function next(err) {
      if (index >= routesArray.length) {
        res.end('Cannot GET ' + pathname);
        return;
      }
      const router = routesArray[index++];
      // 判断是否发生错误
      if (err) {
        // 发生错误，找到错误中间件，交给它处理
        // 中间件判定条件，路径匹配且处理函数的形参必须为4个
        if (isValidMiddleware(router, pathname) && router.handler.length === 4) {
          router.handler(err, req, res, next);
        } else next(err);
      }
      // 中间件, 匹配路径，只能匹配前缀
      else if (isValidMiddleware(router, pathname)) {
        router.handler(req, res, next);
      }
      // 匹配路由、具体方法、all、all-*
      else if ((router.path === pathname && (router.method === method || router.method === 'all'))
        || (router.method === 'all' && router.path === '*')) {
        router.handler(req, res);
      } else
        next();
    }
    next();
  };
  app.listen = function () {
    const server = http.createServer(app);
    server.listen.apply(server, arguments);
  };
  // 定义all请求方法
  app.all = function (path, handler) {
    routesArray.push({
      method: 'all',
      path,
      handler
    });
  };
  // 定义添加中间件的方法
  app.use = function (path, handler) {
    if (typeof handler !== 'function') {
      handler = path;
      path = '/';
    }
    routesArray.push({
      method: 'middleware',
      path,
      handler
    });
  };
  // 通过http.METHODS定义的所有支持的方法遍历添加支持的扩展方法
  http.METHODS.forEach(i => {
    const method = i.toLowerCase();
    app[method] = function (path, handler) {
      routesArray.push({
        method,
        path,
        handler
      });
    }
  });
  return app;
}
module.exports = createApplication;
