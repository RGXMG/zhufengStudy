/**
 * 拦截用户数组的方法，如：
 * push、shift、unshift、pop reverse sort splice
 */

import { observe } from "./index";

// 先提取老的数组方法，只改写这些方法
const oldArrayProtoMethods = Array.prototype;

// 拷贝到一个的新的对象
const arrayMethods = Object.create(oldArrayProtoMethods);

const methods = [
  "push",
  "shift",
  "unshift",
  "pop",
  "reverse",
  "sort",
  "splice"
];

/**
 * 遍历inserted，调用observe函数进行观测
 * observe帮助判断是否为对象，对象才会进行观测
 * @param inserted
 */
function observeArray(inserted) {
  for (const ele of inserted) {
    observe(ele);
  }
}

// 在新对象arrayMethods本身上创建对应的函数，即：
// 在arrayMethods上添加一个push方法，覆盖掉.prototype.push方法
// 但是除了methods中的方法需要被覆盖以外，其他的方法能够正常调用
methods.forEach(m => {
  arrayMethods[m] = function(...args) {
    const res = oldArrayProtoMethods[m].apply(this, args);

    // 对能够新增属性的方法的变量进行观测
    // 需要调用observe方法进行判断是否为对象，为对象则进行观测
    let inserted = null;
    switch (m) {
      case "push":
      case "unshift":
        inserted = args;
        break;
      case "splice":
        // slice方法的第三个参数为插入的元素
        inserted = args[2];
        break;
      default:
    }
    observeArray(inserted);
    // 调用对象上的__ob__方法通知watcher更新
    this.__ob__.dep.notify();
    return res;
  };
});

/**
 * NOTE 为数组内部元素添加依赖
 * 一个数组内部元素都会通过Observe调用observeArray进行观测
 * 所以每个元素只要是对象都会存在__ob__对象，该对象上保存在Observe方法
 * 调用该方法，即可以实现手动添加依赖
 * @param array
 */
function dependArray(array) {
  for (const i of array) {
    i && i.__ob__ && i.__ob__.dep.depend();
    if (Array.isArray(i)) {
      dependArray(i);
    }
  }
}
export { observeArray, dependArray, arrayMethods as default };
