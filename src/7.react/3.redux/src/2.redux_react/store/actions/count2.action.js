import * as actionTypes from "../actionTypes";
const actions = {
  ADD_ACTION2(payload) {
    return { type: actionTypes.ADD_ACTION2, payload };
  },
  REDUCE_ACTION2(payload) {
    return { type: actionTypes.REDUCE_ACTION2, payload };
  }
};
export default actions;
