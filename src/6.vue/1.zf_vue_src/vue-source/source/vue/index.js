import {initState} from './observe'
import Watcher from './observe/watcher';
import {compiler,util} from './util'
function Vue(options){ // vue中原始用户传入的数据
    this._init(options); // 初始化vue 并且将用户选项传入
}

Vue.prototype._init = function (options) {
    // vue中初始化  this.$options 表示的是vue中参数
    let vm = this;
    vm.$options = options;

    // MVVM原理 需要数据重新初始化
    // 拦截数组的方法 和 对象的属性
    initState(vm); // data computed watch
    // ....

    // 初始化工作 vue1.0 =>

    if(vm.$options.el){
        vm.$mount();
    }
}
// 渲染页面 将组件进行挂载
function query(el){
    if(typeof el === 'string'){
        return document.querySelector(el);
    }
    return el
}
// ?: 匹配不捕获 不捕获当前的分组
// + 至少一个
// ? 尽可能少匹配
// 源码里的模板编译 也是基于正则的

Vue.prototype._update = function () {
    console.log('更新操作')
    // 用用户传入的数据 去更新视图
    let vm = this;
    let el = vm.$el;

    // ------------- 一下逻辑 讲完虚拟dom 会用虚拟dom来重写
    // 要循环这个元素 将里面的内容 换成我们的数据
    let node = document.createDocumentFragment();
    let firstChild;
    while(firstChild = el.firstChild){ // 每次拿到第一个元素就将这个元素放入到文档碎片中
        node.appendChild(firstChild); // appendChild 是具有移动的功能 
    }
    // todo 对文本进行替换
    compiler(node,vm);
    el.appendChild(node);
    // 需要匹配{{}}的方式来进行替换
    // 依赖收集 属性变化了 需要重新渲染 watcher 和 dep
}
Vue.prototype.$mount = function () {
    let vm = this;
    let el = vm.$options.el; // 获取元素 // #app
    el = vm.$el= query(el); // 获取当前挂载的节点 vm.$el就是我要挂载的一个元素

    // 渲染时通过 watcher来渲染的
    // 渲染watcher  用于渲染的watcher
    // vue2.0 组件级别更新  new Vue 产生一个组件

    let updateComponent = ()=>{ // 更新组件 、渲染的逻辑
        vm._update(); // 更新组件
    }
    new Watcher(vm,updateComponent); // 渲染watcher，默认会调用updateComponent这个方法
    // 我需要让每个数据 它更改了 需要重新的渲染
}
Vue.prototype.$watch = function (expr,handler,opts) {
    // 原理 创建一个watcher
    let vm = this;
    new Watcher(vm,expr,handler,{user:true,...opts}); // 用户自己定义的watch
}
export default Vue

//1.默认我会创建一个渲染watcher 这个渲染watcher默认会被执行

//2. pushTarget(this); Dep.target = watcher
// this.getter();  调用当前属性的get方法  给当前的属性加了一个dep dep.addSub(watcher)  dep.subs = [watcher]
// popTarget();

//3. 当用户修改了属性的变化后 会调用set方法
// dep.notify() dep.subs.forEach(watcher=>watcher.update())

