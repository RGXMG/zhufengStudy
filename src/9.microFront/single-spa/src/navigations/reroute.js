/**
 * Created with JavaScript.
 * User: RGXMG
 * Email: rickgrimes9229@gmail.com/759237309@qq.com
 * Date: 2020/6/7
 * Time: 11:36
 *
 */
import { isStarted } from "../start";
import {
  getAppsToLoad,
  getAppsToMount,
  getAppsToUnmount,
  getMountedApps,
} from "../application/apps";
import { toLoadPromise } from "../lifecycles/load";
import { toUnmountPromise } from "../lifecycles/unmount";
import { toBootstrapPromise } from "../lifecycles/bootstrap";
import { toMountPromise } from "../lifecycles/mount";
import { callCaptureEvents } from "./hijackLocations";

// 是否处于循环之中
let appChangesUnderway = false;
// 循环的队列
let changesQueue = [];

/**
 * 路由切换会走这个方法，这个方法需要判断是否处于正在加载app中，如果处于，就将新需求放置到changesQueue中
 * 1. 判断是否处于循环之中，非循环，就return
 * 2. 判断应用是否启动，启动就loadApps
 * @param pendings {Array} changesQueue队列中的批处理
 * @param eventArgs {Event} Event事件，主要是路由的改变的事件 popstate/pushState/replaceState
 */
export function reroute(pendings = [], eventArgs) {
  // 当程序需要切换app时，就会将该变量置为true
  // 这样在处理正在卸载某些app时，如果路由又发生了变化，发生了某些事件，我们需要缓存这些事件
  // 避免直接触发这些事件，否则可能会导致本应该被卸载的app监听到了事件作出相应(找不到路由404等等)
  // 待我们卸载完成之后，就需要遍历changesQueue该队列进行通知
  if (appChangesUnderway) {
    return new Promise((resolve, reject) => {
      changesQueue.push({
        success: resolve,
        failure: reject,
        eventArgs,
      });
    });
  }
  // 开始循环
  appChangesUnderway = true;
  // App已启动
  if (isStarted()) {
    return preformAppChanges();
    //没有启动，则加载对应的App, 进行一个按需加载，也就是预加载的过程
  }
  return loadApps();
  /**
   * NOTE 核心 加工执行过程：
   * 1. 先unmount不需要的App
   * 2. 去load app
   * 3. 去mount app
   */
  function preformAppChanges() {
    // https://github.com/single-spa/single-spa/issues/545
    // 自定义事件，在应用状态发生改变之前可触发，给用户提供搞事情的机会
    // window.dispatchEvent(
    //   new CustomEvent(
    //     appsThatChanged.length === 0
    //       ? "single-spa:before-no-app-change"
    //       : "single-spa:before-app-change",
    //     getCustomEventDetail(true)
    //   )
    // );
    //
    // window.dispatchEvent(
    //   new CustomEvent(
    //     "single-spa:before-routing-event",
    //     getCustomEventDetail(true)
    //   )
    // );

    // 拿到需要被卸载的APP进行卸载处理
    let unmountPromise = getAppsToUnmount().map(toUnmountPromise);
    unmountPromise = Promise.all(unmountPromise);

    // 拿到已经成功加载过源码，但是还并未启动过的app
    // 即加载过源码，但是还并未执行过任何生命周期函数的app
    // 然后进行启动、挂载操作
    let loadApps = getAppsToLoad().map((app) =>
      toLoadPromise(app)
        .then(toBootstrapPromise)
        .then((app) => {
          return toMountPromise(app);
        })
    );

    // 拿到需要被挂载的APP进行挂载
    // 合并load以及mount
    let mountApps = getAppsToMount().filter((app) =>
      loadApps.length
        ? Boolean(loadApps.find((item) => item.name === app.name))
        : true
    );
    mountApps = Promise.all(
      loadApps.concat(mountApps).map((app) => {
        const res = toBootstrapPromise(app);
        res.then((app) => {
          return toMountPromise(app);
        });
      })
    );

    return unmountPromise.then(
      () => {
        calAllLocationEvents();
        return mountApps.then(
          () => {
            return finish();
          },
          (e) => {
            pendings.forEach((item) => item.failure(e));
            throw e;
          }
        );
      },
      (e) => {
        calAllLocationEvents();
        console.error(e);
      }
    );
  }

  /**
   * 一次循环完成
   * 1. 拿到被挂载的app作为返回值
   * 2. 循环执行pending中的promise，令其resolve掉
   * 3. 将appChangesUnderway循环开关关闭
   * 4. 如果changedQueue中存在了新的值，再次批量reroute
   */
  function finish() {
    const returnValue = getMountedApps();
    if (pendings.length) {
      pendings.forEach((item) => item.success(returnValue));
    }
    appChangesUnderway = false;
    if (changesQueue.length) {
      const backup = changesQueue;
      changesQueue = [];
      return reroute(backup);
    }
    return returnValue;
  }

  /**
   * 预加载App并且处理这些模块的生命周期函数等
   */
  function loadApps() {
    const canAndNeedLoaded = getAppsToLoad();
    return Promise.all(canAndNeedLoaded.map(toLoadPromise))
      .then(() => {
        return finish();
      })
      .catch((e) => {
        console.error(e);
      });
  }

  function calAllLocationEvents() {
    // eventsQueue有值，则表示是路由改变了
    let eventArgsArr = [];
    if (
      (eventArgsArr = (pendings || []).filter((item) => item.eventArgs)).length
    ) {
      eventArgsArr.forEach((event) => callCaptureEvents(event));
    } else {
      eventArgs && callCaptureEvents(eventArgs[0]);
    }
  }
}
