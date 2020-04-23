import React, { Component } from "react";
import { pathToRegexp } from "path-to-regexp";
import routerContext from "./context";

class Route extends Component {
  static contextType = routerContext;
  render() {
    const {
      location: { pathname }
    } = this.context;
    const { path, children, component: Component } = this.props;
    const regex = pathToRegexp(path, [], { end: false });
    if (pathname.match(regex))
      return Component ? (
        typeof Component === "function" ? (
          <Component />
        ) : (
          Component
        )
      ) : (
        children || null
      );
    return null;
  }
}

export default Route;
