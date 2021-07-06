/**
 * Created with JavaScript.
 * User: RGXMG
 * Email: rickgrimes9229@gmail.com/759237309@qq.com
 * Date: 2020/6/7
 * Time: 11:04
 *
 */
// 未加载，作为新注册的APP的第一状态
const NOT_LOADED = "NOT_LOADED";
// 加载中
const LOAD_RESOURCE_CODE = "LOAD_RESOURCE_CODE";
// 加载成功，但是还未启动
const NOT_BOOTSTRAPPED = "NOT_BOOTSTRAPPED";
// 启动中
const BOOTSTRAPPING = "BOOTSTRAPPING";
// 启动成功，未挂载
const NOT_MOUNTED = "NOT_MOUNTED";
// 挂载中
const MOUNTING = "MOUNTING";
// 挂载成功
const MOUNTED = "MOUNTED";
// 卸载中
const UNMOUNTING = "UNMOUNTING";
// 加载时参数未校验通过，或非致命错误
const SKIP_BECAUSE_BROKEN = "SKIP_BECAUSE_BROKEN";
// 加载时遇到致命错误
const LOAD_ERROR = "LOAD_ERROR";
// 更新service中
const UPDATING = "UPDATING";

function notSkip(app) {
  return app.status !== SKIP_BECAUSE_BROKEN;
}
function withoutLoadError(app) {
  return app.status !== LOAD_ERROR;
}
function isLoaded(app) {
  return (
    app.status !== NOT_LOADED &&
    app.status !== LOAD_ERROR &&
    app.status !== LOAD_RESOURCE_CODE
  );
}
function isntLoaded(app) {
  return !isLoaded(app);
}

function shouldBeAcitive(app) {
  try {
    return app.activityWhen(window.location);
  } catch (e) {
    app.status = SKIP_BECAUSE_BROKEN;
    console.error(e);
  }
}
function isActive(app) {
  return app.status === MOUNTED;
}

function isntActive(app) {
  return !isActive(app);
}
function shouldntBeActive(app) {
  try {
    return !app.activityWhen(window.location);
  } catch (e) {
    app.status = SKIP_BECAUSE_BROKEN;
    throw e;
  }
}

export {
  NOT_LOADED,
  LOAD_RESOURCE_CODE,
  NOT_BOOTSTRAPPED,
  BOOTSTRAPPING,
  NOT_MOUNTED,
  MOUNTING,
  MOUNTED,
  UNMOUNTING,
  SKIP_BECAUSE_BROKEN,
  LOAD_ERROR,
  UPDATING,
  notSkip,
  withoutLoadError,
  isActive,
  isntActive,
  shouldntBeActive,
  isLoaded,
  isntLoaded,
  shouldBeAcitive
};
