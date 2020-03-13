let id = 0;
class Dep {
  constructor() {
    this.id = id++;
    this.subs = [];
  }

  /**
   * 订阅
   * 将watcher保存到数组中
   * @param watcher
   */
  addSub(watcher) {
    this.subs.push(watcher);
  }

  /**
   * 处理dep和watcher的相互依赖：
   */
  depend() {
    // 为了防止直接调用depend方法，此时是没有Dep.target，所以需要判断一下
    if (Dep.target) {
      // Dep.target是一个渲染watcher
      // 在watcher上面添加相应的dep
      Dep.target.addDep(this);
    }
  }
  /**
   * 消息通知，将订阅的watcher全部调用
   */
  notify() {
    this.subs.forEach(watcher => watcher.update());
  }
}
const watcherStack = [];
function pushTarget(watcher) {
  Dep.target = watcher;
  watcherStack.push(watcher);
}
function popTarget() {
  watcherStack.pop();
  Dep.target = watcherStack[watcherStack.length - 1];
}
export { pushTarget, popTarget, Dep as default };
