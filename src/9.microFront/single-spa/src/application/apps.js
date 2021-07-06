/**
 * Created with JavaScript.
 * User: RGXMG
 * Email: rickgrimes9229@gmail.com/759237309@qq.com
 * Date: 2020/6/7
 * Time: 11:04
 *
 */

import {
  NOT_LOADED,
  notSkip,
  shouldntBeActive,
  withoutLoadError,
  isntLoaded,
  shouldBeAcitive,
  isActive,
  isntActive,
  isLoaded
} from "./apps.helper";
import { reroute } from "../navigations/invoke";

// 保存所有的APP
const APPS = [];
/**
 * 注册Application
 * @param appName {string} app名称
 * @param loadFunction {Function | Object} 异步加载函数
 * @param activityWhen {Function} 什么时候加载
 * @param customProps {Object} 自定义的配置信息
 */
function registerApplication(appName, loadFunction, activityWhen, customProps) {
  debugger;
  // 判断值是否合法 省略
  // 归档当前App
  APPS.push({
    app: appName,
    activityWhen,
    loadFunction,
    customProps,
    status: NOT_LOADED
  });

  // 执行循环
  return reroute();
  // console.log(APPS);
}

/**
 * 过滤出需要被load的App
 * 1. 没有加载中断
 * 2. 没有加载错误过
 * 3. 没有加载过
 * 4. 需要被加载，app.activityWhen等于true
 * @returns {*[]}
 */
function getAppsToLoad() {
  return APPS.filter(notSkip)
    .filter(withoutLoadError)
    .filter(isntLoaded)
    .filter(shouldBeAcitive);
}

/**
 * 过滤出需要被卸载的app
 * 1. 没有记载中断
 * 2. 已经被激活
 * 3. 不应该再被激活了
 */
function getAppsToUnmount() {
  return APPS.filter(notSkip)
    .filter(isActive)
    .filter(shouldntBeActive);
}

/**
 * 过滤出需要被挂载的app
 * 1. 没有加载中断
 * 2. 加载过的
 * 3. 没有被激活
 * 4. 应该被激活的
 */
function getAppsToMount() {
  return APPS.filter(notSkip)
    .filter(isLoaded)
    .filter(isntActive)
    .filter(shouldBeAcitive);
}

/**
 * 获取当前已经被挂载的app
 */
function getMountedApps() {
  return APPS.filter(isActive);
}
export {
  getAppsToLoad,
  getMountedApps,
  getAppsToUnmount,
  getAppsToMount,
  registerApplication
};
