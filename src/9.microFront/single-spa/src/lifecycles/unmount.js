/**
 * Created with JavaScript.
 * User: RGXMG
 * Email: rickgrimes9229@gmail.com/759237309@qq.com
 * Date: 2020/6/7
 * Time: 16:20
 *
 */
import {
  MOUNTED,
  NOT_MOUNTED,
  SKIP_BECAUSE_BROKEN,
  UNMOUNTING
} from "../application/apps.helper";
import { reasonableTime } from "../application/timeout";
import { getProps } from "./helper";

/**
 * 处理unmount生命周期函数
 * @param app
 */
function toUnmountPromise(app) {
  if (app.status !== MOUNTED) {
    return Promise.resolve(app);
  }
  app.status = UNMOUNTING;

  // 使用超时函数包裹
  return reasonableTime(
    app.unmount(getProps(app)),
    `app: ${app.name} unmounting`,
    app.timeouts.unmount
  )
    .then(() => {
      app.status = NOT_MOUNTED;
      return app;
    })
    .catch(e => {
      app.status = SKIP_BECAUSE_BROKEN;
      console.error(e);
      return app;
    });
}
export { toUnmountPromise };
