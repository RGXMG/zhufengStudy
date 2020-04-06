function vnode(type, key, props, children = [], text) {
  return {
    type,
    key,
    props,
    children,
    text
  };
}
export { vnode };
