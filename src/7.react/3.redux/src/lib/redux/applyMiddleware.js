import compose from "./compose";
/**
 * NOTE 应用中间件的函数
 *  1. 该函数支持应用多个中间件，其原理跟koa的中间件相似
 *  2. 之所以写成多个函数嵌套的方式，如：applyMiddleware(middleware1, middleware2)(createStore)(reducer)，是因为可能用户在使用的时候传入的参数数量不确定。所以这么设计;
 *  3. 中间件的书写格式：function logger(store) { return function(dispatch) { return function(action) {} } }， 这么设计是因为方便使用洋葱模式，compose组合之后好执行;
 *  4. 多个middleware是采用洋葱模型的执行方式，在一个middleware中间调用的dispatch方法其实已经被改写，此时的dispatch方法实际上是下一个middleware函数
 * @param middleware
 */
export default function applyMiddleware(...middleware) {
  return createStore => (reducer, initialValue) => {
    const store = createStore(reducer, initialValue);

    // NOTE 创建一个仿造的store传入
    let dispatch = () => {
      throw new Error("还不能使用！");
    };
    const storeCopy = {
      // 保留dispatch函数的引用
      dispatch: (...args) => dispatch(...args),
      getState: store.getState
    };

    /**
     * 原有的middleware
     * logger = store => dispatch(next) => action => {}
     * 变为：
     * logger = dispatch(next) => action => {}
     */
    const chain = middleware.map(middleware => middleware(storeCopy));

    // 最后将真正的store.dispatch方法传入，发起真正的action
    dispatch = compose(chain)(store.dispatch);

    return {
      ...store,
      dispatch
    };
  };
}
