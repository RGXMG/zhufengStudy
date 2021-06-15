/**
 * Created with JavaScript.
 * User: rgxmg
 * Email: rgxmg@foxmail.com
 * Date: 2021/6/15
 * Time: 16:28
 *
 */
//=====================================================promise============================

// 异步promise通知
function asyncNotifyPromise(time = 2000) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('msg:::', time);
      resolve(time);
    }, time);
  });
}

// 重点函数
function thunkGenPromise(it) {
  return new Promise((resolve, reject) => {
    try {
      function next(arg) {
        const { done, value } = it.next(arg);
        if (done) return resolve(value);
        value.then(next);
      }
      next();
    } catch (e) {
      reject(e)
    }
  })
}

// 针对promise
function *createReadFilePromise(startMsg) {
  console.log(startMsg);
  var t1 = yield asyncNotifyPromise(1000);
  var t2 = yield asyncNotifyPromise(t1 * 2);
  var t3 = yield asyncNotifyPromise(t2 * 2);
  return t3;
}

thunkGenPromise(createReadFilePromise('hello')).then((msg) => {
  console.log('done:::', msg);
})
