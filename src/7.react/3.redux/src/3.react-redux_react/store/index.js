// import { createStore, bindActionCreators } from "../../lib/redux";
import { createStore, applyMiddleware } from "redux";

const ADD_ACTION = "add";
const REDUCE_ACTION = "reduce";

const action = {
  onAdd() {
    return { type: ADD_ACTION };
  },
  onReduce() {
    return { type: REDUCE_ACTION };
  }
};

function reducer(state = { number: 0 }, { type }) {
  switch (type) {
    case ADD_ACTION:
      return { number: state.number + 1 };
    case REDUCE_ACTION:
      return { number: state.number - 1 };
    default:
      return state;
  }
}
// const store = createStore(reducer);

const logger = store => dispatch => action => {
  console.log("旧值：：：", store.getState());
  dispatch(action);
  console.log("新值：：：", store.getState());
};
const store = applyMiddleware(logger)(createStore)(reducer);
export { action, store as default };
