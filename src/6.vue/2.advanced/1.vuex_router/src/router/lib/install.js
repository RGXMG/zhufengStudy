import registerComponent from "./components";
let _Vue = null;
/**
 * NOTE 安装插件
 *  1. 使用mixin混入$router、$route
 *  2. 注册全局组件
 *  3. 添加响应式数据_route
 * @param Vue
 */
export default function install(Vue) {
  const _this = this;
  _Vue = Vue;
  _Vue.mixin({
    // 混入属性到所有的组件中
    beforeCreate() {
      // 根组件中含有router属性
      if (this.$options.router) {
        this._routerRoot = this;
        this._$router = this.$options.router;
        this._$router.init(this);
        // 向根组件上添加响应式属性_route，值等于当前history的current
        _Vue.util.defineReactive(this, "_route", this._$router.history.current);
        defined();
      } else {
        this._routerRoot = this.$parent && this.$parent._routerRoot;
      }
    }
  });
  registerComponent(_Vue);
}
function defined() {
  // NOTE 定义$route属性，该属性为history的current属性，当前匹配的路由信息
  Object.defineProperty(_Vue.prototype, "$route", {
    get() {
      return this._routerRoot._route;
    }
  });
  // NOTE 定义$router属性，该属性为创建的history对象，可以根据这个属性进行调用history的相关方法
  //  如push，replace等
  Object.defineProperty(_Vue.prototype, "$router", {
    get() {
      return this._routerRoot.history;
    }
  });
}
