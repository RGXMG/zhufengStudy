import React, { Component } from "react";
import { HashRouter as Router, Route, Link } from "../lib";
// import { HashRouter as Router, Route, Link } from "react-router-dom";
import Home from "./Home";
import User from "./User";
import Recommend from "./Recommend";

class Index extends Component {
  render() {
    return (
      <Router>
        <div style={{ margin: 20, border: "solid 1px red" }}>
          <Link to="/" style={{ paddingLeft: 10 }}>
            home
          </Link>
          <Link to="/user" style={{ paddingLeft: 10 }}>
            user
          </Link>
          <Link to="/recommend" style={{ paddingLeft: 10 }}>
            recommend
          </Link>
        </div>
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
    );
  }
}

export default Index;
