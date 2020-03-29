import install from "./install";
import createMatcher from "./createMatcher";
import HashHistory from "./history/hash";
import { createRoute } from "./history/base";
let Vue = null;

/**
 * NOTE Router路由
 *  1. 将用户传入的options数据进行格式化
 *  2. 根据格式化的数据创建匹配器(createMater)
 *
 */
class Router {
  constructor(options) {
    // 创建匹配器，会格式化数据，并创建记录，然后返回match方法，addRoutes方法
    this.matcher = createMatcher(options.routes || []);
    this.history = null;
  }

  /**
   * NOTE 路由的初始化操作
   *  1. 创建history模式类
   *  2. 过渡页面
   *  3. 执行setupListener方法，添加window事件(hashchange事件)
   *  4. 执行history的listen方法，当history内部的current改变之后，更改根组件(app)的响应式属性_route，让页面更新
   */
  init(app) {
    const history = (this.history = new HashHistory(this));
    const setupListener = () => {
      history.setupListener(history.transitionTo.bind(history));
    };
    history.transitionTo(history.getCurrentLocation(), setupListener);
    // NOTE 添加listen的回调
    history.listen(route => {
      app._route = route;
    });
  }

  /**
   * NOTE  路由的匹配方法
   *  调用matcher的match方法
   * @param location
   */
  match(location) {
    const record = this.matcher.match(location);
    const local = {
      path: location
    };
    if (record) {
      return createRoute(record, local);
    }
    return createRoute(null, local);
  }
}

Router.install = install;
export default Router;
