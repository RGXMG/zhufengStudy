const _PENDING = 'pending';
const _FULFILLED = 'FULFILLED';
const _REJECTED = 'REJECTED';
function ReviewPromise(task) {
  // 状态
  this.status = _PENDING;
  // 穿梭的value，从resolve方法或thenable中传递的值
  this.value = void 0;
  // rejected的reason
  this.reason = void 0;
  // 保存thenable的方法 - onFulfilled
  this.onFulfilledCallbacks = [];
  // 保存thenable的方法 - onRejected
  this.onRejectedCallbacks = [];

  // 定义onResolve方法，该方法更改status并且执行onFulfillCallbacks方法
  const resolve = (value) => {
    // 如果resolve方法直接返回一个ReviewPromise实例，则等待then
    if (value instanceof ReviewPromise) {
      return value.then(resolve, reject);
    }
    this.status = _FULFILLED;
    this.value = value;
    this.onFulfilledCallbacks.forEach(cb => {
      // 使用setTimeout模拟Promise的异步执行
      // 根据规范，
      // 确保即使Promise的resolve方法同步执行，thenable方法也能够异步执行
      // new Promise((res, rej) => res(1)).then(v => v);
      setTimeout(() => cb(value))
    })
  };
  // 定义onReject方法，执行的逻辑同上
  const reject = (reason) => {
    this.status = _REJECTED;
    this.reason = reason;
    this.onRejectedCallbacks.forEach(cb => {
      // 使用setTimeout模拟Promise的异步执行
      // 根据规范，
      // 确保即使Promise的resolve方法同步执行，thenable方法也能够异步执行
      // new Promise((res, rej) => res(1)).then(v => v);
      setTimeout(() => cb(reason))
    })
  };
  try {
    task(resolve, reject);
  } catch (e) {
    reject(e);
  }
}

/**
 * 处理resolve的处理结果res
 * 1. res是Promise的实例
 * 2. res为Object或者function，存在thenable方法，为普通对象
 * 3. 基本类型
 * @param rp
 * @param res
 * @param resolve
 * @param reject
 */
const handlePromise = function(rp, res, resolve, reject) {
  // 如果结果值和rp为同一promise对象，则就会陷入死循环，需要抛出typeError错误
  if (res === rp) {
    return reject(new TypeError('循环引用'));
  }
  // 定义一个called变量，避免一些实现不规范的Promise库调用多次
  let called = false;
  if (res instanceof Promise) {
    if (res.status === _PENDING) {
      res.then(res => {
        handlePromise(rp, res, resolve, reject)
      },  reason => {
        reject(reason);
      });
    } else res.then(resolve, reject);
    // res可能为自定义规范的Promise
  } else if (res !== null && (typeof res === 'function' || typeof res === 'object')) {
    try {
      // 尝试读取then方法，避免直接调用保存
      const then = res.then;
      if (typeof then === 'function') {
        then.call(res, (res) => {
          // 判断是否重复调用
          called || (called = true, handlePromise(rp, res, resolve, reject));
        }, (e) => called || (called = true, reject(e)));
        // res为普通的对象
      } else {
        resolve(res);
      }
    } catch (e) {
      called || (called = true, reject(e));
    }
  } else resolve(res);
};

ReviewPromise.prototype.then = function (onFulfilled, onRejected) {
  const _onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : v => v;
  const _onRejected = typeof onRejected === 'function' ? onRejected : e => { throw e };
  // 记录当前Promise的this
  const that = this;
  let newPromise  = null;
  // 等待状态下直接加入当前Promise的callbacks中，将thenable方法关联起来
  if (this.status === _PENDING) {
    newPromise = new ReviewPromise((pResolve, pReject) => {
      that.onFulfilledCallbacks.push((value) => {
        try {
          // 执行thenable方法
          const x =  _onFulfilled(value);
          // 处理结果，
          handlePromise(newPromise, x, pResolve, pReject);
        } catch (e) {
          pReject(e);
        }
      });
      that.onRejectedCallbacks.push((value) => {
        try {
          // 执行thenable方法
          const x =  _onRejected(value);
          // 处理结果，
          handlePromise(newPromise, x, pResolve, pReject);
        } catch (e) {
          pReject(e);
        }
      });
    });
  } else if (this.status === _onFulfilled) {
    newPromise = new ReviewPromise((pResolve, pReject) => {
      // 根据规范，thenable中的方法总是需要异步执行，而且需要保证链式执行
      /**
       * 情况：
       * let p1 = new Promise(res => res());
       * p1.then(() => {
       *   // 当执行这里时，p1的status为fulfilled
       *   // 而添加thenable时，需要保证该方法时异步执行，输出结果为1,2,3
       *   // 所以需要使用异步策略
       *   p1.then(res => {
       *     console.log('3');
       *   });
       *   console.log('1');
       *   return 5;
       * }).then(() => {
       *   console.log('2');
       * });
       */
      setTimeout(() => {
        try {
          // 执行thenable方法
          const x =  _onFulfilled(this.value);
          // 处理结果，
          handlePromise(newPromise, x, pResolve, pReject);
        } catch (e) {
          pReject(e);
        }
      });
    });
  } else if (this.status === _onRejected) {
    newPromise = new ReviewPromise((pResolve, pReject) => {
      setTimeout(() => {
        try {
          // 执行thenable方法
          const x =  _onRejected(that.reason);
          // 处理结果，
          handlePromise(newPromise, x, pResolve, pReject);
        } catch (e) {
          pReject(e);
        }
      });
    });
  }
  return newPromise;
};
module.exports = ReviewPromise;
