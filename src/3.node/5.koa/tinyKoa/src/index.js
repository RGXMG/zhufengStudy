const http = require('http');

module.exports = class  TinyKoa {
  constructor() {
    this.middlewareStack = [];
  }
  listen() {
    http.createServer(this.callback()).listen(...arguments)
  }
  createContext(req, res) {
    return Object.assign(Object.create(null), {
      body: null,
      req,
      res
    });
  }
  compose(middlewareStack) {
    if (!Array.isArray(middlewareStack)) {
      throw new TypeError('中间件组必须为数组');
    }
    for (const i of middlewareStack) {
      if (typeof i !== 'function') {
        throw new TypeError('每一个中间件必须为函数');
      }
    }
    return function (ctx) {
      // index用于确定是否在中间件函数内多次调用了next方法
      let index = -1;
      const len = middlewareStack.length;
      return dispatch(0);
      function dispatch(i) {
        // 调用判断
        // 在同一个中间件中，next函数不能被调用多次
        // index会随着中间件函数的执行，递增
        // 而i是属于dispatch的局部变量，
        // 所以在执行中间件过程中，已经调用过next函数的中间件再次调用next函数时，
        // 内部的dispatch保留的局部变量就会小于随着中间件执行的index变量
        if (i <= index) {
          return new Promise.reject(new Error('在同一个中间件处理函数中，next函数不能被调用多次'))
        }
        const fn = middlewareStack[i];
        // 如果执行下标等于中间件组长度，则是越界，应该直接返回
        if (i === len || !fn) return Promise.resolve();
        // 保存最新执行中间件处理函数的index
        index = i;
        try {
          return Promise.resolve(fn(ctx, dispatch.bind(null, i + 1)))
        } catch (e) {
          return Promise.reject(e);
        }
      }
    }
  }

  /**
   * 返回整个请求的处理
   * 1. 中间件的执行
   * 2. response
   * @returns {Function}
   */
  callback() {
    // 校验中间件，进行合法格式校验
    // 返回一个中间件执行的循环
    const middlewareFn = this.compose(this.middlewareStack);
    return (req, res) => {
      // 创建context
      const ctx = this.createContext(req, res);
      // 进行
      this.handleRequest(middlewareFn, ctx).then(() => this.handleResponse(ctx)).catch((error) => {
        console.error(error);
      })
    };
  }
  use(fn) {
    this.middlewareStack.push(fn);
    return this;
  }

  /**
   * 执行中间件呢
   * @param middlewareFn
   * @param ctx
   * @returns {*}
   */
  handleRequest(middlewareFn, ctx) {
    return middlewareFn(ctx);
  }
  handleResponse(ctx) {
    const body = ctx.body;
    if (typeof body === 'object') {
      ctx.res.end(JSON.stringify(body));
    } else if (typeof body === 'number') {
      ctx.res.end(body + '');
    } else {
      ctx.res.end(body);
    }
  }
};