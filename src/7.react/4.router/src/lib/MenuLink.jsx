import React from "react";
import { Route, Link } from "./index";
function MenuLink(props) {
  const { children, to, ...rest } = props;
  return (
    <Route
      {...{ ...rest, path: to }}
      children={props => {
        console.log("MenuLink:::", to, rest, props);
        return (
          <Link {...rest} className={props.match ? "active" : ""} to={to}>
            {children}
          </Link>
        );
      }}
    />
  );
}
export default MenuLink;
