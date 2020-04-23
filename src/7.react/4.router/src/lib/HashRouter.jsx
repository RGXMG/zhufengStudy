import React, { Component } from "react";
import RouterContext from "./context";

class HashRouter extends Component {
  constructor() {
    super();
    this.state = {
      location: this.getLocationInfo()
    };
  }
  push({ path, state = null }) {
    window.location.hash = "#" + path;
    window.location.state = state;
  }
  getLocationInfo() {
    if (!window.location.hash) {
      window.location.hash = "#/";
    }
    const pathname = window.location.hash.slice(1);
    return { pathname };
  }
  hashChange() {
    this.setState(state => ({
      location: { ...state.location, ...this.getLocationInfo() }
    }));
  }
  componentDidMount() {
    window.addEventListener("hashchange", this.hashChange.bind(this));
  }
  componentWillUnmount() {
    window.removeEventListener(this.hashChange);
  }

  render() {
    const nState = {
      location: this.state.location,
      history: { push: this.push }
    };
    return (
      <RouterContext.Provider value={nState}>
        {this.props.children}
      </RouterContext.Provider>
    );
  }
}

export default HashRouter;
