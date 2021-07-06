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
  getMountedApps
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
  // 应用正在切换，这个状态会在执行performAppChanges之前置为true，执行结束之后再置为false
  // 如果在中间用户重新切换路由了，即走这个if分支，暂时看起来就在数组中存储了一些信息，没看到有什么用
  // 字面意思理解就是用户等待app切换
  // 处于循环中，需要将本地reroute添加到queue中
  // 待调用finish之后，再次进行下一次循环
  if (appChangesUnderway) {
    return new Promise((resolve, reject) => {
      changesQueue.push({
        success: resolve,
        failure: reject,
        eventArgs
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
    // 拿到需要被卸载的APP进行卸载处理
    let unmountPromise = getAppsToUnmount().map(toUnmountPromise);
    unmountPromise = Promise.all(unmountPromise);

    // 拿到需要被加载的APP进行加载并且启动
    let loadApps = getAppsToLoad().map(app =>
      toLoadPromise(app)
        .then(toBootstrapPromise)
        .then(app => {
          debugger;
          toMountPromise(app);
        })
    );

    // 拿到需要被挂载的APP进行挂载
    // 合并load以及mount
    let mountApps = getAppsToMount().filter(app =>
      loadApps.length
        ? Boolean(loadApps.find(item => item.name === app.name))
        : true
    );
    mountApps = Promise.all(
      loadApps.concat(mountApps).map(app => {
        const res = toBootstrapPromise(app);
        res.then(app => {
          debugger;
          toMountPromise(app);
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
          e => {
            pendings.forEach(item => item.failure(e));
            throw e;
          }
        );
      },
      e => {
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
      pendings.forEach(item => item.success(returnValue));
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
    debugger;
    return Promise.all(canAndNeedLoaded.map(toLoadPromise))
      .then(() => {
        return finish();
      })
      .catch(e => {
        console.error(e);
      });
  }

  function calAllLocationEvents() {
    // eventsQueue有值，则表示是路由改变了
    let eventArgsArr = [];
    if (
      (eventArgsArr = (pendings || []).filter(item => item.eventArgs)).length
    ) {
      eventArgsArr.forEach(event => callCaptureEvents(event));
    } else {
      eventArgs && callCaptureEvents(eventArgs[0]);
    }
  }
}
