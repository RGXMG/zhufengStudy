/**
 * Created with JavaScript.
 * User: RGXMG
 * Email: rickgrimes9229@gmail.com/759237309@qq.com
 * Date: 2020/6/7
 * Time: 16:27
 *
 */
import {
  MOUNTED,
  MOUNTING,
  NOT_MOUNTED,
  SKIP_BECAUSE_BROKEN,
} from "../application/apps.helper";
import { reasonableTime } from "../application/timeout";
import { getProps } from "./helper";
import { toUnmountPromise } from "./unmount";

/**
 * 处理mount生命周期函数
 * @param app
 */
function toMountPromise(app) {
  if (app.status !== NOT_MOUNTED) {
    return Promise.resolve(app).then((app) => {
      return app;
    });
  }
  app.status = MOUNTING;

  // 使用超时函数包裹
  return (
    reasonableTime(
      app.mount(getProps(app)),
      `app: ${app.name} mounting`,
      app.timeouts.mount
    )
      .then(() => {
        app.status = MOUNTED;
        return app;
      })
      // 如果APP挂载失败，立即执行卸载操作
      // 防止未加载的APP污染接下来的环境
      // 保证环境的干净
      .catch((e) => {
        // 将status改为mounted，之后马上卸载
        app.status = MOUNTED;
        toUnmountPromise(app);
        console.error(e);
        return app;
      })
  );
}
export { toMountPromise };
