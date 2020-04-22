/**
 * NOTE redux-promise 中间件
 *  1. 支持action函数为promise
 *  2. 支持action中的payload为返回promise的函数
 * @param dispatch
 * @returns {function(*): function(...[*]=)}
 */
function promiseMiddleware({ dispatch }) {
  return next => action => {
    // NOTE 1. 非纯对象，则判断是否为promise，是的话就添加then方法；
    if (!isPlainObject(action)) {
      return isPromise(action) ? action.then(dispatch) : next(action);
    }
    isPromise(action.payload)
      ? action.payload
          // 为对象时可能携带者更多的参数
          .then(res => dispatch({ ...action, payload: res }))
          .catch(error => {
            dispatch({ ...action, payload: error, error: true });
            return Promise.reject(error);
          })
      : next(action);
  };
}
function isPromise(fn) {
  return (
    fn &&
    (typeof fn === "object" || typeof fn === "function") &&
    typeof fn.then === "function"
  );
}
function isPlainObject(obj) {
  if (!obj) return false;
  let proto = obj;
  while (Object.getPrototypeOf(proto)) {
    proto = Object.getPrototypeOf(proto);
  }
  return proto === Object.getPrototypeOf(obj);
}

export default promiseMiddleware;
