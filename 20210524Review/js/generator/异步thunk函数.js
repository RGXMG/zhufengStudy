/**
 * Created with JavaScript.
 * User: rgxmg
 * Email: rgxmg@foxmail.com
 * Date: 2021/6/15
 * Time: 15:48
 * 阮一峰 https://es6.ruanyifeng.com/#docs/generator-async
 */
// 使用thunk函数来时generator函数直接调用，避免频繁写next等

// 异步回调通知
function asyncNotify(time = 2000, callback) {
  setTimeout(() => {
    console.log('msg:::', time);
    callback(time);
  }, time);
}

// thunk函数，针对异步回调
function thunk(fn) {
  return function(...args) {
    return function(cb) {
      try {
        fn.apply(fn, [...args, cb])
      } catch (e) {
        throw new Error(e);
      }
    }
  }
}

// 使generator thunk化函数 - 针对异步回调
// // 重点函数
function thunkGen(it, cb) {
  function next(args) {
    const { done, value } = it.next(args);
    if (done) return cb(value);
    value(next);
  }
  next();
}

// 异步回调
const asyncNotifyThunkify = thunk(asyncNotify);

function *createReadFile(startMsg) {
  console.log(startMsg);
  var t1 = yield asyncNotifyThunkify(1000);
  var t2 = yield asyncNotifyThunkify(t1 * 2);
  var t3 = yield asyncNotifyThunkify(t2 * 2);
  return t3;
}

thunkGen(createReadFile('hello start'), (msg) => {
  console.log('done:::', msg);
});
