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

    // NOTE 5. _subscribe Store内的plugins
    //  插件在一个mutation 发生改变之后就会触发
    this._subscribe = [];
    (options.plugins || []).forEach(fn => fn(this));

    // NOTE 将options中的module进行格式化，将每个modules都转为一个module对象
    //  每个modules都包含{ _rawModule: 指向自身，_children: 子Modules， state: 当前模块的state }
    this._module = new ModuleCollection(options);

    // NOTE 将格式化后的结果进行递归处理，将其中每个modules包含的getters、mutations、actions都代理到根store上面
    //  存放于store上的getters、_mutations、_actions上
    //  对于同名的则使用数组依次放置
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
    this._mutations[name].forEach(fn => {
      fn(payload);
      this._subscribe.forEach(fn => fn({ type: name, payload }, this.state));
    });
  }

  /**
   * dispatch方法，用于访问对应actions方法
   * 采用发布订阅方式
   * @param name
   * @param payload
   */
  dispatch(name, payload) {
    this._actions[name].forEach(fn => {
      fn(payload);
    });
  }

  /**
   * 订阅函数，提供一个mutation的钩子
   * 每次mutation发生改变，都会执行定于的fn函数
   * @param fn
   */
  subscribe(fn) {
    this._subscribe.push(fn);
  }
}

/**
 * NOTE 安装module中的state、getters、mutation、actions到根store中去
 *   其中将各个模块的state保存到根state中去，module的名称就是根store中的属性名，
 *   其中相同名称的getters会被覆盖，而相同的名称的actions和mutation会共存，保存为一个数组，依次执行
 * @param store {Store} 当前的Store实例
 * @param rootState {Object} Store的state对象
 * @param currentPath {Array} 当前处理的modules嵌套path，如[a,b]则表示正在处理a模块下的b模块
 * @param currentModule {Module} 当前处理的module名称
 */
const installModule = (store, rootState, currentPath, currentModule) => {
  const { state = {}, getters, mutations, actions } = currentModule._rawModule;

  // NOTE 1. 安装state，将非根state安装到根state中
  //  并且为了保证数据的双向绑定，要使用Vue.set方法将数据进行监听
  //  如path [a, b] => 则是将b中的state保存到a的state中去。
  if (currentPath.length !== 0) {
    const parentState = currentPath.slice(0, -1).reduce((parent, cur) => {
      return parent[cur];
    }, rootState);
    // NOTE 需要采用Vue.set方法将数据设为响应式
    Vue.set(parentState, currentPath[[currentPath.length - 1]], state);
  }

  // NOTE 2. 安装getters, 重复的会被覆盖, state为当前模块的state
  if (getters) {
    const rootGetters = store.getters;
    Object.keys(getters).forEach(k => {
      Object.defineProperty(rootGetters, k, {
        get() {
          return getters[k](state);
        }
      });
    });
  }

  // NOTE 3. 安装mutations，重复的会被放入数组中依次执行
  if (mutations) {
    const rootMutations = store._mutations;
    Object.keys(mutations).forEach(k => {
      const currentSet = rootMutations[k] || [];
      currentSet.push(payload => {
        return mutations[k](store.state, payload);
      });
      rootMutations[k] = currentSet;
    });
  }

  // NOTE 4. 安装actions，重复的会被放入数组中依次执行
  if (actions) {
    const rootActions = store._actions;
    const method = {
      commit: store.commit.bind(store),
      dispatch: store.dispatch.bind(store),
      state,
      rootState
    };
    Object.keys(actions).forEach(k => {
      const currentSet = rootActions[k] || [];
      currentSet.push(payload => {
        return actions[k](method, payload);
      });
      rootActions[k] = currentSet;
    });
  }

  Object.keys(currentModule._children).forEach(k => {
    installModule(
      store,
      rootState,
      currentPath.concat(k),
      currentModule._children[k]
    );
  });
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
