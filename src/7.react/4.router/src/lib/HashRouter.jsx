import React, { Component } from "react";
import RouterContext from "./context";

class HashRouter extends Component {
  constructor() {
    super();
    this.state = {
      location: this.getLocationInfo()
    };
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
    return (
      <RouterContext.Provider value={this.state}>
        {this.props.children}
      </RouterContext.Provider>
    );
  }
}

export default HashRouter;
