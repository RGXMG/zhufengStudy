/**
 * NOTE 更新类
 * 1. 保存所有的partialState
 * 2. 提供addState方法，该方法会对当前是否为isBatching进行判断
 */
export default class Updater {
  constructor(component) {
    // 保存当前组件
    this.component = component;
    // 存放所有的partial state
    this.pendingPartialState = [];
  }

  /**
   * NOTE 该方法会存在所有传入的partialState
   *  然后判断当前是否处于批量更新时期，
   *  如果处于批量更新中，则将当前的组件放入batchingStrategy的dirtyComponents中(异步更新)
   *  否则直接在调用component的updateComponent方法进行更新(同步更新)
   * @param partialState
   */
  addState(partialState) {
    this.pendingPartialState.push(partialState);
    if (batchingStrategy.isBatchingUpdate) {
      return batchingStrategy.dirtyComponents.push(this.component);
    }
    this.component.updateComponent();
  }
}

/**
 * NOTE 批量更新策略
 */
export const batchingStrategy = {
  // 是否处于批量更新中
  isBatchingUpdate: false,
  // NOTE 所有的脏组件
  //  所谓的脏组件，实际上指的是state与试图不吻合的组件
  //  如一个组件更新了state，但是此刻isBatchingUpdate等于true，则无法立马更新
  //  需要等待之后在更新，所以称此类组件为脏组件
  dirtyComponents: [],
  //  NOTE 批量执行脏组件的updateComponent方法
  batchingUpdateDirtyComponents() {
    batchingStrategy.dirtyComponents.forEach(component =>
      component.updateComponent()
    );
  }
};
