import React, { Component } from "react";
import { pathToRegexp } from "path-to-regexp";
import routerContext from "./context";

class Route extends Component {
  static contextType = routerContext;
  render() {
    const {
      location: { pathname }
    } = this.context;
    // children 任何时候都会渲染
    // component 以及 render 在匹配上才会渲染
    const { 
      path = "/",
      exact,
      render,
      children,
      component: Component
    } = this.props;
    // 保存动态匹配的key值
    let params = [];
    const regex = pathToRegexp(path, params, { end: false });
    const result = pathname.match(regex);

    // 匹配到了，就将params的值与result相对应
    const query = {};
    let match = null;
    if (result) {
      for (let i = 1; i <= params.length; i++) {
        query[params[i - 1].name] = result[i];
      }
      match = {
        path,
        pathname,
        params: query,
        isExact: path === pathname
      };
    }
    const nProps = {
      ...this.context,
      match: match && exact && !match.isExact ? null : match
    };
    if (typeof children === "function") return children(nProps);
    if (match) {
      if (render) {
        return typeof render === "function" ? render(nProps) : render;
      }
      if (Component) {
        return typeof Component === "function" ? <Component /> : Component;
      }
      return children || null;
    }
    return null;
  }
}

export default Route;
