/**
 * NOTE 事务类 react中用来封装的通用的逻辑 (设计模式：AOP 面向切片)
 *  1. 可以在一个函数执行的前后执行一个或者多个wrapper对象的initial和close方法
 */
export default class Transaction {
  constructor(wrapper) {
    this.wrapper = Array.isArray(wrapper) ? wrapper : [wrapper];
  }
  perform(fn) {
    this.wrapper.forEach(wrapper => wrapper.initial());
    fn();
    this.wrapper.forEach(wrapper => wrapper.close());
  }
}
