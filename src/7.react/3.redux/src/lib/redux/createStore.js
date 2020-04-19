/**
 * createStore
 * https://github.com/reduxjs/redux/blob/master/src/createStore.ts
 */

import isPlainObject from "./utils/isPlainObject";
import actionTypes from "./utils/actionTypes";

/**
 * 创建一个store
 * @param reducer
 * @param preloadedState 可选项，如果不传递，则应该在reducer中state赋一个默认值
 * @returns {{getState: (function(): *), dispatch: (function(*=): *), subscribe: (function(*=): unsubscribe)}}
 */
function createStore(reducer, preloadedState) {
  if (typeof reducer !== "function") {
    throw new TypeError("reducer must be function");
  }
  const currentReducer = reducer;
  let currentState = preloadedState;
  const subscribeCallbackArray = [];
  if (currentState === undefined) {
    dispatch({ type: actionTypes.INIT });
  }
  function getState() {
    return currentState;
  }

  /**
   * 执行一个action
   * 1. 必须保证action为一个纯对象，如 {}
   * @param action
   */
  function dispatch(action) {
    if (!isPlainObject(action)) {
      throw new TypeError("action must be plain object");
    }
    const { type, payload } = action;
    if (typeof type === "undefined") {
      throw new TypeError("type must be string");
    }
    // 执行reducer
    currentState = currentReducer(currentState, action);
    // 执行通知
    subscribeCallbackArray.forEach(cb => cb());
    return action;
  }

  /**
   * 订阅函数，当state发生改变时，会调用callback
   * 1. 订阅函数时会返回一个取消订阅的函数
   * @param callback
   */
  function subscribe(callback) {
    // 防止多次调用取消函数
    let isUnsubscribe = false;
    subscribeCallbackArray.push(callback);
    /**
     * 做删除操作
     */
    return function unsubscribe() {
      if (isUnsubscribe) return;
      const index = subscribeCallbackArray.indexOf(callback);
      subscribeCallbackArray.splice(index, 1);
    };
  }

  return {
    getState,
    dispatch,
    subscribe
  };
}
export default createStore;
