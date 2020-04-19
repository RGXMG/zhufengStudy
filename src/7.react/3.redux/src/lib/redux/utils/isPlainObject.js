/**
 * 根据原型判断是否为一个纯对象 {} 而非[]、null
 * @param obj
 * @returns {boolean}
 */
function isPlainObject(obj) {
  if (typeof obj !== "object" || obj === null) {
    return false;
  }
  let proto = obj;
  while (Object.getPrototypeOf(proto)) {
    proto = Object.getPrototypeOf(proto);
  }
  return Object.getPrototypeOf(obj) === proto;
}
export default isPlainObject;
