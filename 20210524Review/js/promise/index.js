/**
 * Created with JavaScript.
 * User: RGXMG
 * Email: rickgrimes9229@gmail.com/759237309@qq.com
 * Date: 2021/6/13
 * Time: 14:22
 * 书写Promise
 * 复习版本，讲解大概意思，并未完成测试通过
 */

// 定义三种全局 promise 状态
const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

function NPromise(task) {
  // 默认初始状态
  this.status = PENDING;
  this.value = void 0;
  this.reason = void 0;
  this.onFulfilledCallbacks = [];
  this.onRejectedCallbacks = [];

  const onResolve = (v) => {
    // 返回了一个Promise，直接等待
    if (v instanceof NPromise) {
      v.then(onResolve, onReject);
    }

    // 保证异步执行
    setTimeout(() => {
      // 保证状态只能有PENDING => FULFILLED， 且不能多次更改
      if (this.status === PENDING) {
        this.value = v;
        this.status = FULFILLED;
        this.onFulfilledCallbacks.forEach(callback => callback(v));
      }
    })
  };

  const onReject = function(reason) {
    setTimeout(() => {
      // 保证状态只能有PENDING => REJECTED， 且不能多次更改
      if (this.status === PENDING) {
        this.reason = reason;
        this.status = REJECTED;
        this.onFulfilledCallbacks.forEach(callback => callback(reason))
      }
    })
  };

  // 保证能够捕获到new Promise((resolve, reject) => {
  //  return new Error('');
  // })
  try {
    task(onResolve, onReject);
  } catch (e) {
    onReject(e)
  }
}

/**
 * 处理then方法的onFulfilled/onRejected返回的值vOrR，存在以下几种情况：
 * 1. vOrR===nPromise，就会陷入循环，即：我等我自己，需要抛出错误；
 * 2. vOrR为Promise的实例，需要判断状态并且等待执行resolve, reject；
 * 3. vOrR为Promise的鸭子模型，则需要谨慎处理，放置多次调用，然后在调用then等待执行resolve, reject；
 * @param nPromise
 * @param vOrR
 * @param resolve
 * @param reject
 */
function handlePromise(nPromise, vOrR, resolve, reject) {
  // 阻止循环引用
  // let p1 = new Promise(resolve => setTimeout(resolve)).then(() => p1)
  if (nPromise === vOrR) {
    throw new TypeError('nPromise 与 vOrR循环引用')
  }

  // 防止鸭子模型的Promise多次调用onFulfilled/onRejected
  // 造成混乱
  let called = false;
  if (vOrR instanceof NPromise) {
    if (vOrR.status === PENDING) {
      // 等待并且再次校验返回值
      vOrR.then(v => {
        handlePromise(nPromise, v,  resolve, reject)
      }, reason => reject(reason));
    } else {
      // 如果 x 已经处于执行态/拒绝态(值已经被解析为普通值)，用相同的值执行传递下去 promise
      vOrR.then(resolve, reject);
    }
  } else if (vOrR !== null && (typeof vOrR.then === 'function' || typeof vOrR.then === 'object')) {
    try {
      vOrR.then(y => {
        if(called) return;
        called = true;
        resolvePromise(nPromise, y, resolve, reject);
      }, reason => {
        if(called) return;
        called = true;
        reject(reason);
      });
    } catch (e) {
      if(called) return;
      called = true;
      reject(e);
    }
  } else {
    resolve(vOrR);
  }
}


/**
 * Promise的then方法，该方法需要实现如下功能：
 * 1. 在pending状态下将then方法传入的俩个回调函数放入当前Promise实例的俩个onFulfilledCallbacks/onRejectedCallbacks中，然后当Promise执行resolve方法的时候进行回调，完成Promise的通知；
 * 2. then方法将返回一个新的Promise，以便支持then的链式调用，并且需要根据不同的status提供Promise构造函数的参数，并且需要主动调用resolve/reject方法，并在方法中判断其返回值；
 * @param onFulfilled
 * @param onRejected
 */
NPromise.prototype.then = function(onFulfilled, onRejected) {
  // 保证onFulfilled以及onRejected为函数
  const _onFulFilled = typeof onFulfilled === 'function' ? onFulfilled : v => v;
  const _onRejected = typeof onRejected === 'function' ? onRejected : v => v;

  // 根据状态判断怎么调用onResolve/onReject方法
  let nPromise = null;

  // pending状态，直接
  if  (this.status === PENDING) {
    nPromise = new NPromise((resolve, reject) => {
      this.onFulfilledCallbacks.push(v => {
        try {
          // 执行then的_onFulFilled方法
          const _v = _onFulFilled(v);
          // 判断_v的值，根据情况决定怎么调用resolve/reject来处理新返回的nPromise
          handlePromise(nPromise, _v, resolve, reject);
        } catch (e) {
          reject(e);
        }
      });

      this.onRejectedCallbacks.push(r => {
        try {
          // 执行then的_onFulFilled方法
          const _v = _onRejected(r);
          // 判断_v的值，根据情况决定怎么调用resolve/reject来处理新返回的nPromise
          handlePromise(nPromise, _v, resolve, reject);
        } catch (e) {
          reject(e);
        }
      })
    });

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
  } else if (this.status === FULFILLED) {
    nPromise = new Promise((resolve, reject) => {
      try {
        const v = _onFulFilled(this.value);
        handlePromise(nPromise, v, resolve, reject);
      } catch (e) {
        reject(e);
      }
    });
  } else if (this.status === REJECTED) {
    nPromise = new Promise((resolve, reject) => {
      try {
        const r = _onRejected(this.reason);
        handlePromise(nPromise, r, resolve, reject);
      } catch (e) {
        reject(e);
      }
    });
  }
  return nPromise;
};

// Promise的Api
function gen(length) {
  let value = [];
  let _index = 0;
  return function(index, value, callback) {
    _index ++;
    value[index] = value;
    _index === length && callback(value);
  }
}

/**
 * 当传入的所有promise都resolve掉后，返回结果
 * @param promises
 */
NPromise.all = function(promises) {
  const length = promises.length;
  const genWatch = gen(length);
  return new Promise((resolve, reject) => {
    promises.forEach((p, index) => {
      p.then(v => genWatch(index, v, resolve), reject);
    })
  });
};

NPromise.race = function (promises) {
  return new Promise((resolve, reject) => {
    promises.forEach(i => i.then(resolve, reject))
  });
};

Promise.allSettled = function(promises) {
  const length = promises.length;
  const genWatch = gen(length);
  return new Promise((resolve) => {
    promises.forEach((p, index) => {
      p.then(v => genWatch(index, { status: 'fulfilled', value: v }, resolve), r => genWatch(index, { status: 'rejected', reason: r }, resolve));
    })
  });
};

Promise.any = function(promises) {
  let length = promises.length;
  const genWatch = gen(length);
  return new Promise((resolve, reject) => {
    promises.forEach(p => {
      p.then(resolve, () => genWatch(0, void 0, () => reject(new Error('All promises were rejected'))));
    })
  });
};

Promise.prototype.finally = function (callback) {
  this.then(() => callback, () => callback);
};
