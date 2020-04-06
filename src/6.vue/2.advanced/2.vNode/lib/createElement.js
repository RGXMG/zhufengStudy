import { vnode } from "./vnode.js";

/**
 * 创建一个元素节点
 * @param type 类型
 * @param props
 * @param children
 */
function createElement(type, props = {}, ...children) {
  let key = props.key;
  delete props.key;
  children = children.map(child => {
    if (typeof child === "object") return child;
    return vnode(void 0, void 0, void 0, void 0, child);
  });
  return vnode(type, key, props, children);
}
export default createElement;
