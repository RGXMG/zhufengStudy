function smellLikeAPromise(promise) {
  if (promise instanceof Promise) {
    return true;
  }
  return (
    promise !== null &&
    (typeof promise === "function" || typeof promise === "object") &&
    typeof promise.then === "function"
  );
}

/**
 * 将所有的声明周期函数展开
 * @param lifecycle
 * @param description
 * @returns {Promise<unknown>}
 */
function flattenLifecycleArray(lifecycle, description) {
  if (!Array.isArray(lifecycle)) {
    lifecycle = [lifecycle];
  }
  if (!lifecycle.length) {
    lifecycle = [() => Promise.resolve()];
  }
  return props =>
    new Promise((resolve, reject) => {
      if (lifecycle.length === 1) {
        return lifecycle[0](props)
          .then(resolve)
          .catch(reject);
      }
      // 将数组形式的生命周期函数利用reduce连接起来，串行执行
      // 同样可以使用next函数代替
      return lifecycle.reduce((a, b) => (resolve, reject) => {
        const memoPromise = a(props);
        if (!smellLikeAPromise(memoPromise)) {
          return reject();
        }
        return memoPromise
          .then(() => b(props))
          .then(resolve)
          .catch(reject);
      })(resolve, reject);
    });
}

/**
 * 读取app传递的props
 * @param app
 * @returns {{name: *}}
 */
function getProps(app) {
  return {
    name: app.app,
    ...app.customProps
  };
}

export { getProps, smellLikeAPromise, flattenLifecycleArray };
