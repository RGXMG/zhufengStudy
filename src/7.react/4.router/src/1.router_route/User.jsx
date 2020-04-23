import React, { Component } from "react";
// import { Link, Switch, Route, Redirect } from "react-router-dom";
import { Link, Switch, Route, Redirect } from "../lib";
import BaseInfo from "./User/BaseInfo";
import Pwd from "./User/Pwd";

class User extends Component {
  render() {
    return (
      <div style={{ marginLeft: 20, display: "flex" }}>
        <div style={{ border: "solid 1px green" }}>
          <Link to="/user/baseInfo">基本信息</Link>
          <br />
          <Link to="/user/pwd">密码信息</Link>
        </div>
        <div style={{ width: 200, border: "solid 1px yellow", marginLeft: 20 }}>
          <Switch>
            <Route path="/user/baseInfo" component={<BaseInfo />} />
            <Route path="/user/pwd" component={Pwd} />
            <Redirect to="/user/baseInfo" />
          </Switch>
        </div>
      </div>
    );
  }
}

export default User;
