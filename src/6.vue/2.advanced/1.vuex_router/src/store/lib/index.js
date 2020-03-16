/**
 * NOTE Vuex实现
 *  1. mutations中实际上可以异步更新，但是规范不推荐这么做
 */
import ModuleCollection from "./ModuleCollection";
let Vue = null;
class Store {
  constructor(options = {}) {
    // NOTE 1. state
    //  将options.state上的属性增加响应式，new Vue
    //  这样在options.state中的值变化之后，就会触发对应页面的Watcher，试图就会更新
    this._s = new Vue({
      data() {
        return {
          state: options.state
        };
      }
    });

    // NOTE 2. getters
    //  获取getters并向Store实例添加getters属性
    //  将所有的options.getters上的key代理到this.getters上
    this.getters = {};
    // Object.keys(options.getters).forEach(key => {
    //   注册get方法，直接获取getter上的函数运行结果
    // Object.defineProperty(this.getters, key, {
    //   get: () => {
    //     return options.getters[key](this.state);
    //   }
    // });
    // });

    // NOTE 3. mutations
    //  采用发布订阅的方式，将所有的mutations属性发布到this._mutations上
    //  this._mutations就是`中间者`，负责消息的收取和转发
    //  发布订阅与观察者模式：https://zhuanlan.zhihu.com/p/51357583
    this._mutations = {};
    // Object.keys(options.mutations).forEach(key => {
    //   this._mutations[key] = payload =>
    //     options.mutations[key](this.state, payload);
    // });

    // NOTE 4. actions
    //  采用发布订阅的方式，将所有的actions属性发布到this._actions上
    //  this._actions就是`中间者`，负责消息的收取和转发
    this._actions = {};
    // Object.keys(options.actions).forEach(key => {
    //   this._actions[key] = payload =>
    //     options.actions[key](
    //       将commit方法的this绑定到当前实例上
    // { state: this.state, commit: this.commit.bind(this) },
    // payload
    // );
    // });

    this._module = new ModuleCollection(options);
    installModule(this, this.state, [], this._module.root);
  }

  /**
   * class 的属性访问器
   * @returns {*}
   */
  get state() {
    return this._s.state;
  }

  /**
   * commit方法，用于访问对应mutations方法
   * 采用发布订阅方式
   * @param name
   * @param payload
   */
  commit(name, payload) {
    this._mutations[name](payload);
  }

  /**
   * dispatch方法，用于访问对应actions方法
   * 采用发布订阅方式
   * @param name
   * @param payload
   */
  dispatch(name, payload) {
    this._actions[name](payload);
  }
}

/**
 * NOTE 安装组件
 * @param store
 * @param rootState
 * @param path
 * @param rootModule
 */
const installModule = (store, rootState, path, rootModule) => {
  // NOTE 1. 安装state

};
const install = _vue => {
  Vue = _vue;
  console.log(Vue.mixins);
  /**
   * NOTE 使用mixins混入向vue中的每个组件实例都注入$store
   *  注意不能直接在Vue.prototype上注册，那样会造成全局注入
   *  再次new Vue但不需要Vuex的时候就会出问题
   */
  Vue.mixin({
    beforeCreate() {
      // NOTE 根组件上的$options上存在store的话就证明使用vuex
      if (this.$options.store) {
        this.$store = this.$options.store;
      } else {
        // NOTE 1. 子组件直接向父组件索要$store
        //  2. 但是要注意，可能父组件没有$store，例如：
        //   a.new Vue({ store, render: h => h(App) });
        //   b.new Vue({ render: h => h(App) });
        //  在a、b中都使用了同一个组件APP，但是b中App没有父组件且$options中没有store
        this.$store = this.$parent ? this.$parent.$store : void 0;
      }
    }
  });
};
const Vuex = {
  install,
  Store
};
export default Vuex;
