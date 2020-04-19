/**
 * NOTE 通过bindActionCreator方法，来简化action派发，可以将dispatch隐藏
 *  1. 支持直接传入一个函数
 *  2. 支持传入多个函数，以对象的方式
 *  3. 每个函数都应该返回action，即 { type: string, payload?: any }
 */
function bindActionCreators(actions, dispatch) {
  if (typeof actions === "function") {
    return bindActionCreator(actions, dispatch);
  }
  let actionObject = {};
  for (const k in actions) {
    if (actions.hasOwnProperty(k)) {
      actionObject[k] = bindActionCreator(actions[k], dispatch);
    }
  }
  return actionObject;
}
function bindActionCreator(actions, dispatch) {
  return function() {
    dispatch(actions.apply(null, arguments));
  };
}
export default bindActionCreators;
