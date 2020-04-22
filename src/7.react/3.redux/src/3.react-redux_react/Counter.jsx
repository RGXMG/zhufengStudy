import React, { Component } from "react";
import { action } from "./store";
import { connect } from "../lib/react-redux";
// import { connect } from "react-redux";

class Counter extends Component {
  render() {
    return (
      <div>
        <hr />
        <h1>react-redux + redux + react结合</h1>
        <h4>number: {this.props.number}</h4>
        <button onClick={this.props.onAsyncAdd}>异步+</button>
        <button onClick={() => this.props.dispatch({ type: "add" })}>+</button>
        <button onClick={this.props.onReduce}>-</button>
      </div>
    );
  }
}

const mapStateToProps = state => ({ number: state.number });
const mapDispatchToProps = function(dispatch) {
  /* NOTE 1. 可以直接返回actions，如下格式：
   const action = {
     onAdd() {
       return { type: ADD_ACTION };
     },
     onReduce() {
       return { type: REDUCE_ACTION };
     }
   };
   */
  // 也可以将dispatch函数注入到组件中
  return {
    dispatch,
    onAsyncAdd: action.onAsyncAdd,
    onReduce: action.onReduce,
    onAdd: action.onAdd
  };

  /*
   NOTE 2. 返回对象，并直接使用dispatch
   return {
      onAdd: () => dispatch({ type: 'add' }),
      onReduce: () => dispatch({ type: 'reduce' }),
   }
  * */
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Counter);
