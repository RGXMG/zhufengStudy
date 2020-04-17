import React from "react";
/**
 * NOTE 模拟React中的PureComponent组件
 *  该组件会重写componentShouldUpdate方法，并且在该方法中对newState和newProps进行浅比较(shallowEqual)
 */
class PureComponent extends React.Component {
  shouldComponentUpdate(nextProps, nextState, nextContext) {
    return (
      !isShallowEqual(this.props, nextProps) ||
      !isShallowEqual(this.state, nextState)
    );
  }
}
export default PureComponent;
function isShallowEqual(oldObj, newObj) {
  if ((oldObj !== newObj && oldObj !== oldObj) || oldObj === newObj)
    return true;
  if (
    typeof oldObj !== null &&
    typeof newObj === "object" &&
    typeof newObj !== null &&
    typeof newObj === "object" &&
    ((Array.isArray(oldObj) && Array.isArray(newObj)) ||
      (!Array.isArray(newObj) && !Array.isArray(oldObj)))
  ) {
    const oldKeys = Object.keys(oldObj);
    const newKeys = Object.keys(newObj);
    if (oldKeys.length !== newKeys.length) return false;
    for (const k of oldKeys) {
      if (oldObj[k] === oldObj[k] && oldObj[k] !== newObj[k]) return false;
    }
    return true;
  }
  return false;
}

console.log(isShallowEqual({}, {}));
