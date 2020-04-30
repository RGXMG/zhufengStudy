import { INCREMENT, DECREMENT } from "../actionTypes/counter.actionTypes";
import { push } from "connected-react-router";
export default {
  increment() {
    return { type: INCREMENT };
  },
  decrement() {
    return { type: DECREMENT };
  },
  toHome() {
    return push("/home");
  }
};
