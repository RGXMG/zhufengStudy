export default {
  name: "vue-router",
  functional: true,
  render(h, { parent, data }) {
    const $route = parent.$route;
    const matched = $route.matched;
    data._routerView = true;
    let deep = 0;

    // NOTE 1.从父元素向上查找，查看当前渲染的router-view位于第几层级
    while (parent) {
      console.log(deep);
      if (parent.$vnode && parent.$vnode.data._routerView) {
        deep += 1;
      }
      parent = parent.$parent;
    }
    const record = matched[deep];
    console.log(record);
    if (!record) {
      return h();
    }
    if (record.component) {
      return h(record.component, data);
    }
  }
};
