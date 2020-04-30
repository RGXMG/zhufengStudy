import {
  createStore,
  applyMiddleware,
  bindActionCreators,
  compose
} from "redux";
import { createBrowserHistory, createHashHistory } from "history";
import { routerMiddleware } from "connected-react-router";
import actionsAll from "./actions";
import createReducers from "./reducers";

const history = createHashHistory();

const store = createStore(
  createReducers(history),
  {},
  applyMiddleware(routerMiddleware(history))
);
window.store = store;
const actions = bindActionCreators(actionsAll, store.dispatch);

export { history, store as default, actions };
