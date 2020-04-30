import React, { Component } from "react";
import RouterContext from "./context";

/**
 * NOTE BrowserRouter
 *  1. 监听window.on('popstate')方法，当浏览器前进后退时改变路由
 *  2. 代理window.history.pushState，当执行pushState方法时，改变路由状态
 */
let oldPushState = window.history.pushState;
class BrowserRouter extends Component {
  constructor() {
    super();
    this.message = null;
    this.state = {
      location: this.getLocationInfo(),
      history: {
        push: this.push.bind(this),
        block: m => (this.message = m)
      }
    };
  }
  push({ path, state = null }) {
    if (this.message !== null) {
      const confirm = window.confirm(
        typeof this.message === "function"
          ? this.message(this.state)
          : this.message
      );
      if (!confirm) return;
    }
    this.message = null;
    oldPushState.call(window.history, state, null, path);
    this.pathChange();
  }
  getLocationInfo() {
    if (!window.location.pathname) {
      window.location.pathname = "/";
    }
    const { pathname } = window.location;
    return { pathname };
  }
  pathChange() {
    this.setState(state => ({
      location: { ...state.location, ...this.getLocationInfo() }
    }));
  }
  componentDidMount() {
    window.onpopstate = this.pathChange;
  }
  componentWillUnmount() {
    window.onpopstate = null;
  }

  render() {
    return (
      <RouterContext.Provider value={this.state}>
        {this.props.children}
      </RouterContext.Provider>
    );
  }
}

export default BrowserRouter;
