import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";
import counter from "./counter.reducer";
export default history =>
  combineReducers({
    counter,
    router: connectRouter(history)
  });
