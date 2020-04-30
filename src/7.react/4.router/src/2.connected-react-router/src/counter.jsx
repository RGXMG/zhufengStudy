import React, { Component } from "react";
import { connect } from "react-redux";
import { actions } from "../store";

class Counter extends Component {
  render() {
    console.log(this.props);
    return (
      <div>
        <h2>{this.props.counter.number}</h2>
        <button onClick={this.props.increment}>+</button>
        <button onClick={this.props.decrement}>-</button>
        <button onClick={this.props.toHome}>toHome</button>
      </div>
    );
  }
}
const mapStateToProps = state => ({ counter: state.counter });
const mapDispatchToProps = function() {
  console.log(arguments);
  return actions;
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Counter);
