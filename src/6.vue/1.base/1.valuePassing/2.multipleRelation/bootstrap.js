import Vue from "vue";

/**
 * NOTE $dispatch向上派发方法
 * 通过当前vm上向上查找$parent，然后出发在$parent上绑定的事件
 * 不同于eventBus，eventBus是全局发送事件
 * @param eventName
 * @param value
 */
Vue.prototype.$dispatch = function(eventName, value) {
  let parent = this.$parent;
  while (parent) {
    parent.$emit(eventName, value);
    parent = parent.$parent;
  }
};

/**
 * NOTE $broadcast向下派发方法
 * 通过当前的vm上向下查找$children，递归的派发方法
 * 采用先序深度遍历
 * @param eventName
 * @param value
 */
Vue.prototype.$broadcast = function(eventName, value) {
  function broadcast(vm, eName, value) {
    if (vm.$children.length) {
      vm.$children.forEach(vm => {
        if (vm.$children.length) {
          broadcast(vm, eName, value);
        }
        vm.$emit(eName, value);
      });
    }
  }
  broadcast(this, eventName, value);
};
console.log("bootstrap: ---");
