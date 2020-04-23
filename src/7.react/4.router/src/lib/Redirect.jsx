import React, { Component } from "react";
import routerContext from "./context";

class Redirect extends Component {
  static contextType = routerContext;
  render() {
    const { history } = this.context;
    history.push({ path: this.props.to });
    return null;
  }
}

export default Redirect;
