/**
 * NOTE 1. 在vue2.0中，vue这个API使用的是es5的普通函数构造调用，而非es6的类; 是因为想要将各个方法提取出出来，放置到其他文件中，不然放在一个类中，代码量很大，当然也能使用继承等法方案解决。
 *    es5: function vue() {};
 *         vue.prototype.render = function() {}
 */
import { initState } from "./observe";
import Watcher from "./observe/watcher";
import { compilerText } from "./utils";
function Vue(options) {
  // 初始化Vue，并且将用户选项传入
  this._init(options);
}

/**
 * Vue的初始化
 * @param options
 * @private
 */
Vue.prototype._init = function(options) {
  const vm = this;
  // this.$options表示的就是Vue中的参数
  vm.$options = options;

  // MVVM原理 需要将数据重新初始化，并且设置响应式
  // M：model 数据
  // V：view 视图
  // VM：view model 视图模型，view <-> model 双向更新
  // data computed watch
  initState(vm);

  // 进行挂在元素
  this.$mount();
};

function query(el) {
  if (typeof el === "string") {
    return document.querySelector(el);
  }
  return el;
}

/**
 * 递归node，将为nodeType = 3，也就是文本节点的元素进行编译
 * @param node
 * @param vm
 */
function compiler(node, vm) {
  const childNodes = node.childNodes;
  childNodes.forEach(child => {
    if (child.nodeType === 1) {
      compiler(child, vm);
    } else if (child.nodeType === 3) {
      compilerText(child, vm);
    }
  });
}

Vue.prototype._update = function() {
  const vm = this;
  const el = vm.$el;

  // NOTE 没有虚拟DOM的时候的渲染函数-
  // 循环元素，将里面的内容 换成vm.$data中的数据
  // 创建Fragment文档碎片，将元素保存在内存中，提升性能
  const node = document.createDocumentFragment();
  let firstChild;
  // 循环取出元素，加入到文档碎片中
  while ((firstChild = el.firstChild)) {
    // appendChild方法：如果目标存在，则会被裁或移动
    node.appendChild(firstChild);
  }
  // 匹配{{}}进行替换
  compiler(node, vm);
  el.appendChild(node);
};
Vue.prototype.$mount = function() {
  const vm = this;
  let el = (vm.$el = query(vm.$options.el));

  // 渲染时通过 watcher 来渲染的
  // 渲染watcher 用于渲染的watcher
  // vue2.0 组价级别更新 new Vue 产生一个组件

  const updateComponent = () => {
    vm._update();
  };
  // 渲染watcher
  // 默认就会调用updateComponent方法
  new Watcher(vm, updateComponent);

  //
};
/**
 * 创建一个watcher
 * 该watcher会被所依赖的数据所添加
 * 当数据发生变化后，就会运行handler
 * 通过该watch方法创建的watcher都属于用户自身的watcher
 * @param key
 * @param handler
 * @param options
 */
Vue.prototype.$watch = function(key, handler, options) {
  new Watcher(this, key, handler, { user: true, ...options });
};
export default Vue;
