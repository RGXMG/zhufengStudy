const Layer = require('./layer');
const http = require('http');

function Route(path) {
  this.path = path;
  // 放置当前route,也就是当前path下的所有信息层layer
  this.stack = [];
  // 表示此路由包含的处理方法的处理函数
  this.methods = {};
}
Route.prototype.handle_method = function(method) {
  return this.methods[method.toLowerCase()];
};
http.METHODS.forEach(method => {
  method = method.toLowerCase();
  Route.prototype[method] = function (...arguments) {
    this.methods[method] = true;
    arguments.forEach(handler => {
      // 每个route都会拥有自己的layer
      // layer里面存放着当前route的信息
      const layer = new Layer(this.path, handler);
      layer.method = method;
      this.stack.push(layer);
    });
    return this;
  }
});
/**
 *
 * @param req
 * @param res
 * @param out
 */
Route.prototype.dispatch = function (req, res, out) {
  let idx = 0;
  const next = (err) => {
    // 出错，直接跳出当前route 执行下一个Router中的layer
    if (err) {
      return out(err);
    }
    if (idx >= this.stack.length) {
      return out();
    }
    const layer = this.stack[idx ++];
    if (layer.method === req.method.toLowerCase()) {
      layer.handle_request(req, res, next);
    } else next();
  };
  next();
};
module.exports = Route;