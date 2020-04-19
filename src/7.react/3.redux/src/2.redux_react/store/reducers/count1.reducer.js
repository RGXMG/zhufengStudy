import * as actionTypes from "../actionTypes";
function reducer(state = 0, { type }) {
  switch (type) {
    case actionTypes.ADD_ACTION1:
      return state + 1;
    case actionTypes.REDUCE_ACTION1:
      return state - 1;
    default:
      return state;
  }
}
export default reducer;
