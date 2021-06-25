/**
 * 1. 渲染使用，vue2.0一个组件的渲染对应一个watcher
 * 2. 计算属性也要使用
 * 每次产生一个watcher 都要产生一个唯一的标识
 */

import Dep, { pushTarget, popTarget } from "./dep";
import nextTick from "./nextTick";
import { getValue } from "../utils";

class Watcher {
  /**
   * 创建观察者
   * @param vm
   * @param exprOrFn 表达式或者函数
   * @param cb 回调函数
   * @param opts 其他参数
   */
  constructor(vm, exprOrFn, cb = () => {}, opts = {}) {
    this.vm = vm;
    this.exprOrFn = exprOrFn;
    // exprOrFn为函数时，则为component的渲染函数
    if (typeof this.exprOrFn === "function") {
      this.getter = exprOrFn;
    } else {
      // NOTE 让被观测的值与watcher发生关系
      // 获取需要watch的数据的值，触发该数据的get，将该watcher添加到数据的dep对象中
      // 待数据发生变化后，就能触发watcher
      // 同时这里也是保存旧值的唯一途径
      this.getter = () => getValue(vm, exprOrFn);
    }

    if (opts.user) {
      this.user = true;
    }

    // 一个watcher对应的dep
    // 当组件进行渲染时，需要更新对应的dep
    this.deps = [];

    // dep的id集合，使用Set进行保存，避免重复
    // 不能保存重复的dep，避免重复渲染
    this.depsId = new Set();
    this.cb = cb;
    this.opts = opts;

    // lazy为true代表computed属性
    this.lazy = opts.lazy;
    // 用dirty做computed的缓存
    this.dirty = this.lazy;

    // 创建一个watcher，就会调用自身的get方法
    this.value = this.lazy ? undefined : this.get();

    // NOTE 配置 immediate
    // 立即执行
    if (opts.immediate) {
      this.cb(this.value);
    }
  }

  /**
   * NOTE 处理watcher和dep的依赖关系
   * 1. 该watcher保存dep的id并且将dep添加到deps
   * 2. 调用dep的addSub方法，将watcher添加到dep上
   * @param dep
   */
  addDep(dep) {
    const id = dep.id;
    if (!this.depsId.has(id)) {
      this.depsId.add(id);
      this.deps.push(dep);
      dep.addSub(this);
    }
  }

  get() {
    // 渲染watcher Dep.target = watcher
    pushTarget(this);
    // 调用call，保证在getter函数能够使用vm
    const value = this.getter.call(this.vm);
    popTarget();
    return value;
  }

  /**
   * NOTE 获取computed的值，并让观测值将computed创建的watcher加入dep中
   * 1. 调用get方法，让watcher切换Dep.target到当前watcher，
   * 2. 然后get方法中就会调用getter方法，也就是computed计算属性的函数，然后在其中使用到的观测值触发get，就会将该target对应的watcher加入到dep中；
   */
  evaluate() {
    this.value = this.get();
    this.dirty = false;
  }

  /**
   * NOTE 为computed中所使用的watcher所包含的dep中添加渲染watcher
   * 当computed中所使用的的数据发生变化，就会触发watcher的update方法
   * updated方法中奖dirty置为true，然后触发添加的渲染watcher，
   * 渲染watcher就会触发computed的get方法，get方法中就会重新计算值，
   * 待值计算完之后，就会缓存在watcher上的value
   */
  depend() {
    console.log(this.deps.length);
    let i = this.deps.length;
    while (i--) {
      this.deps[i].depend(Dep.target);
    }
  }
  update() {
    if (this.lazy) {
      this.dirty = true;
    } else {
      queueWatcher(this);
    }
  }
  run() {
    const value = this.get();
    if (this.user && value !== this.value) {
      this.cb(this.value, value);
    }
  }
}
// watcher ids
let has = {};
// watcher 队列
let queue = [];

/**
 * NOTE 将watcher组装成一个队列进行更新
 * 当多个相同dep触发notify的时候，
 * 不会重复多次更新，将会使用nextTick延迟更新
 * @param watcher
 */
function queueWatcher(watcher) {
  const id = watcher.id;
  if (has[id] !== true) {
    has[id] = true;
    queue.push(watcher);

    // 延迟清空队列
    nextTick(flushQueue);
  }
}
function flushQueue() {
  queue.forEach(watcher => watcher.run());
  has = {};
  queue = [];
}
// Vue.nextTick();
export { nextTick, Watcher as default };
