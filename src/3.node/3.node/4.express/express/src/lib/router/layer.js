const pathToRegexp = require('path-to-regexp');
function Layer(path, handler) {
  this.path = path;
  this.handler = handler;
  // 当前path的param的key值
  // /user/:uid/:name -> [{name: 'uid', ...}, {name: 'name', ...}]
  this.keys = [];
  // 当前path的param正则
  // /user/:uid/:name -> /^\/user\/(?:([^\/]+?))\/(?:([^\/]+?))\/?$/i
  this.regexp = pathToRegexp(path, this.keys);
}

/**
 * 判断传入的path是否匹配
 * 1. 路由layer层
 * 2. 中间件层
 * 3. 是否匹配当前path的param参数
 * @param path
 */
Layer.prototype.match = function (path) {
  if (this.path === path || (!this.route && path.startsWith(this.path + '/'))) {
    return true;
  } else {
    // /^\/user\/(?:([^\/]+?))\/(?:([^\/]+?))\/?$/i
    // /user/592/xmg
    // ->  [/user/592/xmg, '592', 'xmg', ...]
    const execRes = this.regexp.exec(path);
    if (execRes) {
      this.params = {};
      for (let i = 0; i < this.keys.length; i ++) {
        this.params[this.keys[i].name] = execRes[i + 1];
      }
      return true;
    }
    return false;
  }
};
Layer.prototype.handle_request = function (req, res, next) {
  if (this.handler.length === 4) {
    return next();
  }
  this.handler(req, res, next);
};
Layer.prototype.handle_error = function (err, req, res, next) {
  // 如果是错误中间件，参数为4个，则执行
  if (this.handler.length !== 4) {
    return next(err);
  }
  this.handler(err, req, res, next);
};
module.exports = Layer;
