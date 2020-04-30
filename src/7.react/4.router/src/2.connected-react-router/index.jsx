import React, { Component } from "react";
import { Provider } from "react-redux";
import { Link, Route, Switch } from "react-router-dom";
import { ConnectedRouter } from "connected-react-router";
import store, { history } from "./store";
import Home from "./src/home";
import Counter from "./src/counter";
class Index extends Component {
  render() {
    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <Link style={{ marginRight: 10 }} to="/home">
            Home
          </Link>
          <Link to="/counter">Counter</Link>
          <div
            style={{
              marginTop: 10,
              border: "solid 1px #ddd",
              width: 400,
              height: 200
            }}
          >
            <Switch>
              <Route path="/home" component={Home} />
              <Route path="/counter" component={Counter} />
            </Switch>
          </div>
        </ConnectedRouter>
      </Provider>
    );
  }
}

export default Index;
