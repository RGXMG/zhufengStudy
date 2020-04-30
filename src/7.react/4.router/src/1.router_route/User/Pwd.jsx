import React, { Component } from "react";
import { Prompt } from "../../lib";

class Pwd extends Component {
  state = {
    blocking: false
  };
  onChange = ({ target: { value } }) => {
    this.setState({ blocking: !!value });
  };
  render() {
    return (
      <div>
        <Prompt
          when={this.state.blocking}
          message={pathname => `确认要跳转到${pathname}?`}
        />
        Pwd
        <input type="text" onChange={this.onChange} />
      </div>
    );
  }
}

export default Pwd;
