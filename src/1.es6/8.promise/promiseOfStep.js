const statusObj = {
  PENDING: 'pending',
  RESOLVED: 'fulfilled',
  REJECTED: 'rejected',
};
const getFn = (any, identify) => (typeof any === 'function' ? any : identify || (any => any));
function PromiseStep(task) {
  const that = this;
  this._status = statusObj.PENDING;
  this._value = undefined;
  this._reason = undefined;
  this._thenArgsOfResolved = [];
  this._thenArgsOfRejected = [];

  const resolved = function(val) {
    if(val instanceof PromiseStep) {
      return val.then(resolved, rejected);
    }
    // 保证then方法能够在下一次队列中执行
    // 保证当前队列不会阻塞，不会影响同步代码的执行
    setTimeout(function() {
      if (that._status === statusObj.PENDING) {
        that._status = statusObj.RESOLVED;
        // 保存方法返回来的值
        that._value = val;
        // 循环执行保存的then方法
        that._thenArgsOfResolved.forEach(item => item(that._value));
      }
    });
  };
  const rejected = function(res) {
    // 保证then方法能够在下一次队列中执行
    // 保证当前队列不会阻塞，不会影响同步代码的执行
    setTimeout(function() {
      if (that._status === statusObj.PENDING) {
        that._status = statusObj.REJECTED;
        that._reason = res;
        that._thenArgsOfRejected.forEach(item => item(that._reason));
      }
    });
  };
  try {
    task(resolved, rejected);
  } catch (e) {
    rejected(e);
  }
}
const handlePromise = function(promise, likePromise, resolved, rejected) {
  if (promise === likePromise) {
   return rejected(new TypeError('重复引用！'));
  }
  // 兼容性处理，避免其他不符合规范的promise多次调用
  let called = false;
  // 如果likePromise是promise的实例
  if (likePromise instanceof Promise) {
    if (likePromise.status === statusObj.PENDING) {
      likePromise.then(function(res) {
        handlePromise(promise, res, resolved, rejected);
      }, function(e) {
        rejected(e);
      });
    }
    else {
      likePromise.then(resolved, rejected);
    }
  } else if (likePromise !== null && (typeof likePromise === 'function' || typeof likePromise === 'object')) {
    try {
      // 监控取then抛出是否会抛出异常
      const then = likePromise.then;
      if (typeof then === 'function') {
        then.call(likePromise, function(v) {
          if(called) return;
          called = true;
          handlePromise(promise, v, resolved, rejected);
        }, function(e) {
          if(called) return;
          called = true;
          rejected(e);
        });
      } else resolved(likePromise);
    } catch (e) {
      if(called) return;
      called = true;
      rejected(e);
    }
  } else resolved(likePromise);
};
/**
 *
 * @param resolved
 * @param rejected
 * @returns {null}
 */
PromiseStep.prototype.then = function(resolved, rejected) {
  const onThenResolved = getFn(resolved);
  const onThenRejected = getFn(rejected, e =>  { throw e });
  const that = this;
  let newPromise = null;
  // 前一个Promise处于pending状态，将
  if (this._status === statusObj.PENDING) {
    newPromise = new PromiseStep(function(res, rej) {
      that._thenArgsOfResolved.push(function() {
        try {
          const v = onThenResolved(that._value);
          handlePromise(newPromise, v, res, rej);
        } catch (e) {
          rej(e);
        }
      });
      that._thenArgsOfRejected.push(function() {
        try {
          const v = onThenRejected(that._reason);
          handlePromise(newPromise, v, res, rej);
        } catch (e) {
          console.log();
          rej(e);
        }
      });
    });
    // 前一个Promise处于Resolved状态，
  } else if (this._status === statusObj.RESOLVED) {
    newPromise = new PromiseStep(function(res, rej) {
      setTimeout(function() {
        try {
          const x = onThenResolved(that._value);
          handlePromise(newPromise, x, res, rej);
        } catch (e) {
          rej(e);
        }
      });
    });
  } else if (this._status === statusObj.REJECTED) {
    newPromise = new PromiseStep(function(res, rej) {
      setTimeout(function() {
        try {
          const x = onThenRejected(that._reason);
          handlePromise(newPromise, x, res, rej);
        } catch (e) {
          rej(e);
        }
      });
    });
  }
  return newPromise;
};
PromiseStep.prototype.catch = function(rejected) {
  this.then(null, rejected);
};
PromiseStep.deferred = PromiseStep.defer = function() {
  let def = {};
  def.promise = new PromiseStep(function(res, rej) {
    def.resolve = res;
    def.reject = rej;
  });
  return def;
};
try {
  // module.exports = PromiseStep;
  module.exports = PromiseStep;
} catch (e) {

}
// window.PromiseStep = PromiseStep;
