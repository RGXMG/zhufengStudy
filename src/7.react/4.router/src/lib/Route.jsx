import React, { Component } from "react";
import routerContext from "./context";

class Route extends Component {
  static contextType = routerContext;
  render() {
    const {
      location: { pathname }
    } = this.context;
    const { path } = this.props;
    if (path === pathname) return this.props.children;
    return null;
  }
}

export default Route;
