import React, { Component } from "react";
import { pathToRegexp } from "path-to-regexp";
import routerContext from "./context";

/**
 * NOTE Switch组件，根据当前的pathname判断其children中哪一个能够满足条件，即返回哪个元素渲染
 */
class Switch extends Component {
  static contextType = routerContext;
  render() {
    const {
      location: { pathname }
    } = this.context;
    const { children } = this.props;
    for (const child of children) {
      const {
        props: { path = "/", extra = false }
      } = child;
      // 根据extra判断是要生成精确的正则
      const regexp = pathToRegexp(path, [], { end: extra });
      // NOTE 注意此时的child只是一个通过React.createElement创建的元素，非类、组件实例、只是一个虚拟DOM(react的元素)；
      // NOTE 待该组件挂载到页面上后，才是生成了组建的实例
      if (pathname.match(regexp)) return child;
    }
    return null;
  }
}

export default Switch;
