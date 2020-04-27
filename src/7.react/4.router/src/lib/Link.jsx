import React, { Component } from "react";
import routerContext from "./context";

class Link extends Component {
  static contextType = routerContext;
  render() {
    const { className, style } = this.props;
    return (
      <a
        className={className}
        href={"#/" + this.props.to}
        style={style || {}}
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
