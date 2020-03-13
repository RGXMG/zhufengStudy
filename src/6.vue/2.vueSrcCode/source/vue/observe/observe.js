import { observe } from "./index";
import arrayMethods, { observeArray, dependArray } from "./array";
import Dep from "./dep";
/**
 * 创建一个数据监听
 */
class Observe {
  // data就是vm._data
  constructor(data) {
    // NOTE 在Observe上添加的dep
    // 此dep是为了
    this.dep = new Dep();

    // NOTE 因为在检测Array的7个方法中，当数据改变时，也应该调用Observe的notify方法
    // 但是在监听Array的方法这种，没有办法直接调用Observe的notify方法
    // 所以采取在对象本身上面添加一个__ob__属性指向当前的Observe
    // 之所以在所有的对象上面添加该属性，也是想可以通过该属性对一个对象是否被监听可以做出判断
    Object.defineProperty(data, "__ob__", {
      get: () => this
    });

    // NOTE 定义数组的观测方式
    // 1. 观测数组的7大能改变数组本身的方法，如push等
    // 2. 循环数组的每一项，如果项本身为对象，则进行再次观测
    if (Array.isArray(data)) {
      Object.setPrototypeOf(data, arrayMethods);
      observeArray(data);
    }
    // 定义观测Object的方法
    // 1. 遍历对象Object上的keys值，循环观测对应的值
    else {
      this.walk(data);
    }
  }
  walk(data) {
    const keys = Object.keys(data);
    for (let key of keys) {
      const value = data[key];
      defineReactive(data, key, value);
    }
  }
}

/**
 * NOTE 重点：定义响应式数据的变化
 * 1. 观测data上的[key]属性
 * 2. 调用observe方法，进行观测value
 * 3. 创建依赖收集Dep
 * @param data
 * @param key
 * @param value
 */
function defineReactive(data, key, value) {
  const childOb = observe(value);
  const dep = new Dep();
  // vue 不支持ie8 即ie8以下的浏览器
  Object.defineProperty(data, key, {
    get() {
      // 在使用观测的值得时候，会调用get方法
      // 此时就证明有地方在使用该值，所以我们需要将其添加到dep.sub中
      // 这样就形成了依赖收集
      if (Dep.target) {
        // NOTE depend方法处理互相依赖，针对Object
        // dep变化通知多个watcher，watcher变化也要通知相应的dep变化
        dep.depend(Dep.target);

        // NOTE 对数组添加依赖
        // 如果存在child为object的情况，则表明当前childOb观测的对象可能为数组
        // 因为数组不会进入该defineReactive方法, 所以数组就没有添加依赖，则需要手动再次添加；
        // 即使当前childOb观测的对象为非数组，由于addSub方法内部做了判断，也不会触发添加观测；
        if (childOb) {
          childOb.dep.addSub(Dep.target);

          // 如果为数组，则可能为多维数组，例如 [[1,[2]],123,[]]，则需要递归的进行添加依赖的处理
          if (Array.isArray(value)) {
            dependArray(value);
          }
        }
      }
      return value;
    },
    set(newValue) {
      console.log("set::", key);
      if (value === newValue) return;
      // 当设置该观测值的时候，就进行通知
      // 当设置新值时，调用observe进行判断和观测
      observe(newValue);
      value = newValue;
      dep.notify();
    }
  });
}
export { defineReactive, Observe as default };
