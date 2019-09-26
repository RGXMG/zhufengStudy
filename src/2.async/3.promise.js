const statusObject = {
  PENDING: 'pending',
  FULFILLED: 'fulfilled',
  REJECTED: 'rejected',
};

const Promise = function(executor) {
  const that = this;
  // 初始化status为pending
  that._status = statusObject.PENDING;
  that._thenableArgsOfResolvedArray = [];
  that._thenableArgsOfRejectedArray = [];
  that._value = undefined;
  that._reason = undefined;

  function resolved(value) {
    if (value instanceof Promise) {
      return value.then(resolved, rejected);
    }

    setTimeout(function() {
      if (that._status === statusObject.PENDING) {
        that._status = statusObject.FULFILLED;
        that._value = value;
        that._thenableArgsOfResolvedArray.forEach(item => item(value))
      }
    });
  }

  function rejected(reason) {
    setTimeout(function() {
      if (that._status === statusObject.PENDING) {
        that._status = statusObject.REJECTED;
        that._reason = reason;
        that._thenableArgsOfRejectedArray.forEach(item => item(reason))
      }
    });
  }

  try {
    executor(resolved, rejected);
  } catch (e) {
    rejected(e);
  }
};

const handlePromise = function(newPromise, x, resolve, reject) {
  // 首先判断x地址是否等于newPromise
  if (x === newPromise) {
    return reject(new TypeError('循环引用'));
  }
  let isCall = false;
  // 判断是否为Promise对象
  if (x instanceof Promise) {
    if (x._status === statusObject.PENDING) {
      x.then(
        function(v) {
          handlePromise(newPromise, v, resolve, reject);
        },
        function(e) {
          reject(e);
        }
        );
    } else {
      x.then(resolve, reject);
    }
  } else if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
    try {
      const then = x.then;
      if (typeof then === 'function') {
        then.call(x, function(v) {
            if (isCall) return;
            isCall = true;
            handlePromise(newPromise, v, resolve, reject);
          },
          function(e) {
            if (isCall) return;
            isCall = true;
            reject(e);
          });
      } else {
        resolve(x);
      }
    } catch (e) {
      if (isCall) return;
      isCall = true;
      reject(e);
    }
  } else {
    resolve(x);
  }
};

Promise.prototype.then = function(res, rej) {
  const that = this;
  const thenRes = typeof res === 'function' ? res : v => v;
  const thenRej = typeof rej === 'function' ? rej : e => { throw e };
  let newPromise = null;
  if (that._status === statusObject.PENDING) {
    newPromise = new Promise(function(newRes, newRej) {
      that._thenableArgsOfResolvedArray.push(function() {
       try {
         const x = thenRes(that._value);
         handlePromise(newPromise, x, newRes, newRej);
       } catch (e) {
         newRej(e);
       }
      });
      that._thenableArgsOfRejectedArray.push(function() {
        try {
          const x = thenRej(that._reason);
          handlePromise(newPromise, x, newRes, newRej);
        } catch (e) {
          newRej(e);
        }
      });
    })
  } else if (that._status === statusObject.REJECTED) {
    newPromise =  new Promise(function(newRes, newRej) {
      setTimeout(function() {
        try {
          const x = thenRej(that._reason);
          handlePromise(newPromise, x, newRes, newRej);
        } catch (e) {
          newRej(e);
        }
      });
    });
  }
  else if (that._status === statusObject.FULFILLED) {
    newPromise =  new Promise(function(newRes, newRej) {
      setTimeout(function() {
        try {
          const x = thenRes(that._value);
          handlePromise(newPromise, x, newRes, newRej);
        } catch (e) {
          newRej(e);
        }
      });
    });
  }
  return newPromise;
};
// 测试代码
Promise.deferred = function() { // 延迟对象
  let defer = {};
  defer.promise = new Promise((resolve, reject) => {
    defer.resolve = resolve;
    defer.reject = reject;
  });
  return defer;
};
Promise.prototype.catch = function(fn) {
  return this.then(null, fn);
};
Promise.prototype.finally = function(fn) {
  return this.then(fn, fn);
};
const count = function(len, resCB) {
  let _len = 0;
  const resArray = [];
  return function(i, val) {
    resArray[i] = val;
    if (++_len === len) resCB(resArray);
  }
};
Promise.all = function(promisesArray) {
  return new Promise(function(res, rej) {
    const done = count(promisesArray.length, res);
    promisesArray.forEach((promise, i) => {
      promise.then(v => done(i, v), rej);
    });
  });
};
Promise.race = function(promisesArray) {
  return new Promise(function(res, rej) {
    promisesArray.forEach(promise => {
      promise.then(res, rej);
    });
  })
};
Promise.resolve = function(value) {
  return new Promise(function(res) { res(value) });
};
Promise.reject = function(reason) {
  return new Promise(function(res, rej) { rej(reason) });
};
module.exports = Promise;