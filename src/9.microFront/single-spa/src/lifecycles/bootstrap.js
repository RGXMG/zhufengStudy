/**
 * Created with JavaScript.
 * User: RGXMG
 * Email: rickgrimes9229@gmail.com/759237309@qq.com
 * Date: 2020/6/7
 * Time: 16:20
 *
 */
import {
  BOOTSTRAPPING,
  NOT_BOOTSTRAPPED,
  NOT_MOUNTED,
  SKIP_BECAUSE_BROKEN
} from "../application/apps.helper";
import { reasonableTime } from "../application/timeout";
import { getProps } from "./helper";

/**
 * 处理bootstrap生命周期函数
 * @param app
 */
function toBootstrapPromise(app) {
  if (app.status !== NOT_BOOTSTRAPPED) {
    return Promise.resolve(app);
  }
  app.status = BOOTSTRAPPING;

  // 使用超时函数包裹
  return reasonableTime(
    app.bootstrap(getProps(app)),
    `app: ${app.name} bootstrapping`,
    app.timeouts.bootstrap
  )
    .then(() => {
      debugger;
      app.status = NOT_MOUNTED;
      return app;
    })
    .catch(e => {
      debugger;
      app.status = SKIP_BECAUSE_BROKEN;
      console.error(e);
      return app;
    });
}
export { toBootstrapPromise };
