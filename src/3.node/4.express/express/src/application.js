const http = require('http');
// 实现Router和应用的分离
const Router = require('./lib/router');
function Application() {
  // return this._router = new Router();
}
Application.prototype.lazyrouter = function() {
  if (!this._router) {
    this._router = new Router();
  }
};
http.METHODS.forEach(method => {
  method = method.toLowerCase();
  Application.prototype[method] = function () {
    this.lazyrouter();
    this._router[method](...arguments);
    return this;
  }
});
// 中间件和普通的路由都是放置在一起的
Application.prototype.use = function () {
  this.lazyrouter();
  this._router.use.apply(this._router, arguments);
};
Application.prototype.listen = function() {
  const server = http.createServer((req, res) => {
    function done() {
      res.end(`Cannot ${req.method} ${req.url}`);
    }
    // 如果路由系统无法处理，也没有一条路由规则跟请求匹配，是会把请求交给done
    this._router.handle(req, res, done);
  });
  server.listen(...arguments);
};
module.exports = Application;
