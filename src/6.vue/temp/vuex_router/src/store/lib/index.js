let Vue = null;
class Store {
  constructor(options = {}) {
    this.state = options.state;
  }
}
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
