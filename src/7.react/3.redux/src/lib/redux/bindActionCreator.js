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
      actionObject[k] =
        k === "dispatch" ? actions[k] : bindActionCreator(actions[k], dispatch);
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

function add1(str) {
  console.log(1);
  return "1" + str;
}
function add2(str) {
  console.log(2);
  return "2" + str;
}
function add3(str) {
  console.log(3);
  return "3" + str;
}
function add4(str) {
  console.log(4);
  return "4" + str;
}
function compose(...fns) {
  return fns.reduce((a, b) => (...args) => a(b(...args)));
  // let fn = null;
  // let str = "";
  // while ((fn = fns.pop())) {
  //   str = fn(str);
  // }
  // return l => str + l;
}
console.log(
  compose(
    add1,
    add2,
    add3,
    add4
  )("xmg")
);
