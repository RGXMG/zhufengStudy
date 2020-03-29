/**
 * NOTE History的基类
 *  其中包含所有不同种类的路由的公共方法，如跳转，渲染组件等等
 */
export default class History {
  constructor(router) {
    this.route = router;
    this.onCurrentChange = null;
    this.current = createRoute(null, {
      matched: [],
      path: "/"
    });
  }

  /**
   * 过渡到某个location
   * @param toLocation
   * @param onComplete {Function} 完成时的回调
   */
  transitionTo(toLocation, onComplete) {
    const routeObject = this.router.match(toLocation);
    // 如果新生成的path和matched的长度和this.current的属性一样的话
    // 表示路径为发生改变
    if (
      this.current.matched.length === routeObject.matched.length &&
      this.current.path === routeObject.path
    ) {
      return;
    }
    this.updateRoute(routeObject);
    onComplete && onComplete();
  }
  updateRoute(route) {
    this.current = route;
    this.onCurrentChange && this.onCurrentChange(route);
  }
  listen(cb) {
    this.onCurrentChange = cb;
  }
}

/**
 * NOTE 创建route
 *  1. 根据record记录创建匹配路由
 *  2. 最后返回一个 { path, matched }
 * @param record
 * @param location
 */
export function createRoute(record, location) {
  let matched = [];
  let curRecord = record;
  // 从当前匹配项向上查找，然后反向推入
  // 如当前匹配路径为： /about/a，则表示matched应为[{path: '/about'}, {path: '/a'}]
  // 这样在渲染时才能够保证从父元素依次渲染到子组件
  while (curRecord) {
    matched.unshift(curRecord);
    curRecord = curRecord.parent;
  }
  return {
    ...location,
    matched
  };
}
