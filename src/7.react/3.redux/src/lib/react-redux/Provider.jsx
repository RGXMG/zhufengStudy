/**
 * NOTE 该组件用于向子组件提供store中的state及action值，是利用react的context
 */
import React, { Component } from "react";
import ReduxContext from "./context";

class Provider extends Component {
  render() {
    return (
      <ReduxContext.Provider value={this.props.store}>
        {this.props.children}
      </ReduxContext.Provider>
    );
  }
}

export default Provider;
