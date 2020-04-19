/**
 * 生成随机的36位字符串
 * @returns {string}
 */
const randomString = () =>
  Math.random()
    .toString(36)
    .substring(7)
    .split("")
    .join(".");

/**
 * redux内部使用的dispatch action
 * @type {{INIT: string}}
 */
const ActionTypes = {
  // 初始化init，当使用redux的createStore未传入初始化的state时，则需要在reducer中为state默认赋值
  // 所以在redux中，如果未指定默认的state，就会主动发起一次dispatch，去初始化state
  INIT: `@@redux/INIT${randomString()}`
};
export default ActionTypes;
