/**
 * Created with JavaScript.
 * User: RGXMG
 * Email: rickgrimes9229@gmail.com/759237309@qq.com
 * Date: 2020/6/7
 * Time: 15:25
 *
 */

// 规定app相关的超时配置
const TIMEOUTS = {
  bootstrap: {
    milliseconds: 3000,
    rejectWhenTimeout: false
  },
  mount: {
    milliseconds: 3000,
    rejectWhenTimeout: false
  },
  unmount: {
    milliseconds: 3000,
    rejectWhenTimeout: false
  }
};

/**
 * 判断一个lifecycle函数是否超时
 * @param lifecyclePromise
 * @param description
 * @param timeout
 */
function reasonableTime(lifecyclePromise, description, timeout) {
  // 设置一个变量, 默认没有完成
  let finished = false;
  return new Promise((resolve, reject) => {
    lifecyclePromise
      .then(() => {
        finished = true;
        resolve();
      })
      .catch(() => {
        finished = true;
        reject(description);
      });

    // 设置一个定时器，如果在timeout.milliseconds内，
    // 还未执行上面的lifecyclePromise.then方法，则表示超时
    setTimeout(() => {
      if (finished) {
        return;
      }
      if (timeout.rejectWhenTimeout) {
        reject(description);
      } else {
        console.log(`timeout:::${description}`);
      }
    }, timeout.milliseconds);
  });
}

/**
 * 确保App上能够拿到完成的timeouts配置
 * @param appConfig
 * @returns {{unmount: {milliseconds: number, rejectWhenTimeout: boolean}, bootstrap: {milliseconds: number, rejectWhenTimeout: boolean}, mount: {milliseconds: number, rejectWhenTimeout: boolean}}}
 */
function ensureAppTimeouts(appConfig) {
  return {
    ...TIMEOUTS,
    ...(appConfig.timeouts || {})
  };
}

export { TIMEOUTS, ensureAppTimeouts, reasonableTime };
