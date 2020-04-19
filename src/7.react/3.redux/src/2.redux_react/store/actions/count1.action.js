import * as actionTypes from "../actionTypes";
const actions = {
  ADD_ACTION1(payload) {
    return { type: actionTypes.ADD_ACTION1, payload };
  },
  REDUCE_ACTION1(payload) {
    return { type: actionTypes.REDUCE_ACTION1, payload };
  }
};
export default actions;
