const url = require('url');
const http = require('http');
const pathToRexg = require('path-to-');
const Route = require('./route');
const Layer = require('./layer');

const proto = Object.create(null);
function Router() {
  // 为了兼容use中间件的第二个参数是函数
  function router(req, res, next) {
    router.handle(req, res, next);
  }
  Object.setPrototypeOf(router, proto);
  router.stack = [];
  return router;
}

// 创建一个路由实例， 相当前路由系统中添加一个层
proto.route = function (path) {
  const route = new Route(path);
  const layer = new Layer(path, route.dispatch.bind(route));
  layer.route = route;
  this.stack.push(layer);
  return route;
};
http.METHODS.forEach(method => {
  method = method.toLowerCase();
  proto[method.toLowerCase()] = function (path, ...rest) {
    // 往当前router里面添加一层
    const route = this.route(path);
    // 向Route里面添加一层
    route[method](...rest);
    return this;
  }
});
proto.use = function (path, handler) {
  if (typeof handler !== 'function') {
    handler = path;
    path = '/';
  }
  const layer = new Layer(path, handler);
  // 中间件没有route
  layer.route = undefined;
  this.stack.push(layer);
};
/**
 * 1. 中间中间件
 * 2. 处理子路由器
 * 3. 处理子路径
 * @param req
 * @param res
 * @param out
 */
proto.handle = function (req, res, out) {
  // slasAdded是否添加过'/'，removed值得是被移除过得字符串
  let idx = 0, slasAdded = false, removed = '';
  const {pathname} = url.parse(req.url);
  // 循环匹配路由层级
  // 匹配到了就直接调用路由层的处理方法
  const next = (err) => {
    // 匹配时拼接上前面移除的前缀
    if (removed.length > 0) {
      req.url = removed + req.url;
      removed = '';
    }
    if (idx >= this.stack.length) {
      return out(err);
    }
    const layer = this.stack[idx++];
    if (layer.match(pathname)) {
      // 处理中间件
      if (!layer.route) {
        // 错误存在，则尝试执行错误处理
        if (err) {
          return layer.handle_error(err, req, res, next);
        }
        // 提取除去layer.path的部分，
        // 去尝试匹配use添加的新的Router系统中handle方法
        // 如：/user/2 -> /2
        if (layer.path !== '/' && layer.path.length < req.url.length) {
          const removed = layer.path;
          req.url = req.url.slice(removed.length);
        }
        layer.handle_request(req, res, next);
      } else if (layer.route.handle_method(req.method.toLowerCase())) {
        layer.handle_request(req, res, next);
      }
    }
    else {
      next(err);
    }
  };
  next();
};
proto.param = function (name, handler) {

};
module.exports = Router;