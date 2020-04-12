import Updater, { batchingStrategy } from "./Updater";
import Transaction from "./Transaction";
/**
 * Component 类
 * 1. 提供state管理、setState
 * 2. 提供renderElement
 * 3. 提供重新渲染的能力
 */
export default class Component {
  constructor(props) {
    this.props = props;
    // 更新类，会将所有的partialState交给它保管
    this.$updater = new Updater(this);
    this.eventTransaction = new Transaction({
      // 1. 将批量更新开启，让一个事件处理函数中同步调用setState设置的partialState异步批量统一更新
      initial() {
        batchingStrategy.isBatchingUpdate = true;
      },
      // 2. 待事件处理函数结束之后，将批量更新关闭，然后再批量执行同步设置的state，让视图更新
      close() {
        batchingStrategy.isBatchingUpdate = false;
        batchingStrategy.batchingUpdateDirtyComponents();
      }
    });
  }

  /**
   * 将传入的partial添加到$updater
   * @param partialState
   */
  setState(partialState = {}) {
    this.$updater.addState(partialState);
  }

  /**
   * NOTE 更新组件
   *  该方法可能会从俩个地方触发：
   *   1. $updater的addState中直接触发(同步)
   *   2. batchingStrategy中的batchingUpdateDirtyComponents方法中(异步)
   */
  updateComponent() {
    this.$updater.pendingPartialState.forEach(partialState =>
      Object.assign(this.state, partialState)
    );
    this.reRender();
  }

  /**
   * NOTE 全局代理方法
   *  1. 将批量更新开启，让一个事件处理函数中同步调用setState设置的partialState异步批量统一更新
   *  2. 待事件处理函数结束之后，将批量更新关闭，然后再批量执行同步设置的state，让视图更新
   * @param event
   * @param methods
   */
  trigger = (event, methods) => {
    this.eventTransaction.perform(
      event.target.component[methods].bind(event.target.component)
    );
  };

  createDomFormStringDom(stringDom) {
    const div = document.createElement("div");
    div.innerHTML = stringDom;
    Array.prototype.forEach.call(div.children, i => (i.component = this));
    return div;
  }

  /**
   * 重新渲染
   */
  reRender() {
    this.oldElement = this.element;
    this.element = this.createDomFormStringDom(this.render());
    this.oldElement.parentElement.replaceChild(this.element, this.oldElement);
  }

  /**
   * 挂载
   * @param container
   */
  mount(container) {
    window.trigger = this.trigger;
    this.element = this.createDomFormStringDom(this.render());
    container.appendChild(this.element);
  }
}
