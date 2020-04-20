import React, { Component } from "react";
import Counter from "./Counter";
import store from "./store";
import { Provider } from "../lib/react-redux";
// import { Provider } from "react-redux";

class Index extends Component {
  render() {
    return (
      <Provider store={store}>
        <Counter />
      </Provider>
    );
  }
}

export default Index;
