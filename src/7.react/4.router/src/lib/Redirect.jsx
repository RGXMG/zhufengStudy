import React, { Component } from "react";
import routerContext from "./context";

class Redirect extends Component {
  static contextType = routerContext;
  componentDidMount() {
    const { history } = this.context;
    history.push({ path: this.props.to });
  }

  render() {
    return null;
  }
}

export default Redirect;
