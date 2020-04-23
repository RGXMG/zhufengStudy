import React, { Component } from "react";
import { HashRouter as Router, Route } from "../lib";
import Home from "./Home";
import User from "./User";
import Recommend from "./Recommend";

class Index extends Component {
  render() {
    return (
      <>
        <div style={{ margin: 20, border: "solid 1px red" }}>
          <a style={{ paddingLeft: 10 }} href="/#/">
            home
          </a>
          <a style={{ paddingLeft: 10 }} href="/#/user">
            user
          </a>
          <a style={{ paddingLeft: 10 }} href="/#/recommend">
            recommend
          </a>
        </div>
        <Router>
          <Route path="/">
            <Home />
          </Route>
          <Route path="/user">
            <User />
          </Route>
          <Route path="/recommend">
            <Recommend />
          </Route>
        </Router>
      </>
    );
  }
}

export default Index;
