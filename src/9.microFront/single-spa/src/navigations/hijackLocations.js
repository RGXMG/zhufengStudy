/**
 * Created with JavaScript.
 * User: RGXMG
 * Email: rickgrimes9229@gmail.com/759237309@qq.com
 * Date: 2020/6/7
 * Time: 18:50
 *
 */
import { reroute } from "./invoke";

const HIJACK_EVENTS_NAME = /^(hashchange|popstate)$/;
const EVENTS_POOL = {
  hashchange: [],
  popstate: [],
};
function urlReroute() {
  reroute([], arguments);
}

// 拦截hashchange以及popstate事件
// 保证微前端的俩个事件第一个被处理
window.addEventListener("hashchange", urlReroute);
window.addEventListener("popstate", urlReroute);

// 缓存原生事件
const originalAddEventListener = window.addEventListener;
const originalRemoveEventListener = window.removeEventListener;

// 重写addEventListener
window.addEventListener = function (eventName, handler) {
  if (eventName && HIJACK_EVENTS_NAME.test(eventName)) {
    !EVENTS_POOL[eventName].includes(handler) &&
      EVENTS_POOL[eventName].push(handler);
  } else {
    originalAddEventListener.apply(this, arguments);
  }
};
// 重写removeEventListener
window.removeEventListener = function (eventName, handler) {
  if (eventName && HIJACK_EVENTS_NAME.test(eventName)) {
    EVENTS_POOL[eventName].includes(handler) &&
      (EVENTS_POOL[eventName] = EVENTS_POOL[eventName].filter(
        (i) => i !== handler
      ));
  } else {
    originalRemoveEventListener.apply(this, arguments);
  }
};

/**
 * 因为reroute函数接受一个event对象参数
 * 所以通过该函数模拟一个event对象作为参数传递给reroute函数
 * PopStateEvent对象继承于Event对象
 * @param state
 */
function mockPopStateEvent(state) {
  return new PopStateEvent(state);
}

// 代理pushState以及replaceState事件
const originalPushState = window.history.pushState;
const originalReplaceState = window.history.replaceState;
// 重写pushState方法
window.history.pushState = function (state, title, url) {
  const result = originalPushState.apply(this, arguments);
  reroute(mockPopStateEvent(state));
  return result;
};
window.history.replaceState = function (state, title, url) {
  const result = originalReplaceState.apply(this, arguments);
  reroute(mockPopStateEvent(state));
  return result;
};

/**
 * 一个hashchange或者popstate事件等被触发
 * 在singleSpa执行完finish之后，
 * 需要调用EVENTS_POOL内部存放的其他监听者设置的事件处理函数
 * @param eventsArgs
 */
export function callCaptureEvents(eventsArgs) {
  if (!eventsArgs) return;
  if (!Array.isArray(eventsArgs)) {
    eventsArgs = [eventsArgs];
  }
  if (EVENTS_POOL[eventsArgs.type] && EVENTS_POOL[eventsArgs.type].length) {
    EVENTS_POOL[eventsArgs].forEach((i) => i.apply(this, eventsArgs));
  }
}
