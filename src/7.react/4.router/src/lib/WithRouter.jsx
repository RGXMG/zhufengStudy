import React from "react";
import { Route } from "./index";
export default function WithRouter(Component) {
  return <Route component={Component} />;
}
