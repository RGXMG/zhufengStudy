import React, { Component } from "react";
import { HashRouter as Router, Route, Link, MenuLink } from "../lib";
// import { HashRouter as Router, Route, Link } from "react-router-dom";
import Home from "./Home";
import User from "./User";
import Recommend from "./Recommend";

class Index extends Component {
  render() {
    return (
      <Router>
        <div style={{ margin: 20, border: "solid 1px red" }}>
          <MenuLink exact to="/" style={{ padding: 5 }}>
            home
          </MenuLink>
          <MenuLink to="/user" style={{ padding: 5 }}>
            user
          </MenuLink>
          <MenuLink to="/recommend/2/name" style={{ padding: 5 }}>
            recommend
          </MenuLink>
        </div>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/user">
          <User />
        </Route>
        <Route path="/recommend/:id/:name">
          <Recommend />
        </Route>
      </Router>
    );
  }
}

export default Index;
