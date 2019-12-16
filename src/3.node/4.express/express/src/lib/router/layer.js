function Layer(path, handler) {
  this.path = path;
  this.handler = handler;
}

/**
 * 判断传入的path是否匹配
 * 1. 路由layer层
 * 2. 中间件层
 * @param path
 */
Layer.prototype.match = function (path) {
  return this.path === path || (!this.route && path.startsWith(this.path + '/'))
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