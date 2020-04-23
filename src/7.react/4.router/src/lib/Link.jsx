import React, { Component } from "react";
import routerContext from "./context";

class Link extends Component {
  static contextType = routerContext;
  render() {
    return (
      <a
        href={"#/" + this.props.to}
        style={this.props.style || {}}
        onClick={e => {
          e.preventDefault();
          this.context.history.push({ path: this.props.to });
        }}
      >
        {this.props.children}
      </a>
    );
  }
}

export default Link;
