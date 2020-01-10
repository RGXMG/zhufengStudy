const Layer = require('./layer');
module.exports = class Router {
  constructor() {
    this.routeStack = [];
  }
  all(path, handler) {
    this.routeStack.push(new Layer(path, 'all', handler));
  }
  compose(stack, ctx, exit) {
    let index = -1;
    return dispatch(0);
    function dispatch(i) {
      if (i < index) {
        throw new Error('next不能多次调用');
      }
      index = i;
      const { handler } = stack[i] || {};
      if (!handler) return exit();
      return Promise.resolve(handler(ctx, dispatch.bind(null, i + 1)))
    }
  }
  routeMatch(ctx) {
    const { method, path } = ctx;
    debugger;
    return this.routeStack.filter(i => (i.method === 'all' || i.method === method) && i.path === path);
  }
  router() {
    return async (ctx, next) => {
      return this.compose(this.routeMatch(ctx), ctx, next);
    }
  }
};
