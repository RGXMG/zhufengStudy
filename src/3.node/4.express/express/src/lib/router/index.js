const url = require('url');
const http = require('http');
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
  // 声明一个param相关的回调函数保存器
  // 当handle request时匹配到了param就从该容器中取得回调函数
  router.paramCallbacks = [];
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
proto.param = function(path, handler) {
  if (!this.paramCallbacks[path]) {
    this.paramCallbacks[path] = [];
  }
  this.paramCallbacks[path].push(handler);
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
    // 通过layer层的match方法去比较是否该自己处理
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
      } else if (layer.params && Object.keys(layer.params).length) {
        // 设置req中的params
        req.params = layer.params;
        // 进行params的callbacks处理
        this.process_params(layer, req, res, (layer, req, res) => {
          layer.handle_request(req, res, next);
        });
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
/**
 * 在该函数中处理param的callback
 * @param layer
 * @param req
 * @param res
 * @param out
 */
proto.process_params = function (layer, req, res, out) {
  let indexOfKeys = 0, indexOfCallbacks = 0;
  const keys = layer.keys;
  const paramCallbacks = this.paramCallbacks;
  const nextToKey = function() {
    if (indexOfKeys >= keys.length) {
      return out(layer, req, res);
    }
    const name = keys[indexOfKeys++].name;
    const value = layer.params[name];
    const paramCallback = paramCallbacks[name];
    if (!paramCallback) {
      return nextToKey();
    }
    const nextToCb = function() {
      if (indexOfCallbacks >= paramCallback.length) {
        return nextToKey();
      }
      const cb = paramCallback[indexOfCallbacks ++];
      cb(req, res, nextToCb, value, name);
    };
    nextToCb();
  };
  nextToKey();
};
module.exports = Router;
