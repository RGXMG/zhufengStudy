/**
 * NOTE 该项目中演示纯redux如何与react项目结合，并自定义bindActionCreator
 */

import React from "react";
import store, { actions } from "./store";

/**
 * NOTE redux + react, 建立一个Counter 组件
 *   该组件中使用store中的数据并更新自己的数据
 */
class Counter extends React.Component {
  constructor() {
    super();
    this.state = {
      countTimes1: 0,
      countTimes2: 0
    };
  }
  componentDidMount() {
    // NOTE 在该方法内subscribe store的变化，然后更新组件内部的state
    this.unsubscribe = store.subscribe(() => {
      const state = store.getState();
      this.setState({
        countTimes1: state.count1 * state.count1,
        countTimes2: state.count2 * state.count2
      });
    });
  }
  componentWillUnmount() {
    // NOTE 在该生命周期内部将监听的store变化取消
    this.unsubscribe();
  }
  render() {
    return (
      <div>
        <hr />
        <h1>redux + react结合</h1>
        <div
          style={{
            display: "inline-block",
            width: 150,
            paddingRight: 15,
            borderRight: "solid 1px red"
          }}
        >
          <h4>count1: {store.getState().count1}</h4>
          <h4>component: {this.state.countTimes1}</h4>
          <button onClick={actions.ADD_ACTION1}>+</button>
          <button onClick={actions.REDUCE_ACTION1}>-</button>
        </div>
        <div
          style={{
            display: "inline-block",
            width: 150,
            paddingLeft: 15,
            borderRight: "solid 1px red"
          }}
        >
          <h4>count2: {store.getState().count2}</h4>
          <h4>component: {this.state.countTimes2}</h4>
          <button onClick={actions.ADD_ACTION2}>+</button>
          <button onClick={actions.REDUCE_ACTION2}>-</button>
        </div>
      </div>
    );
  }
}
export default Counter;
