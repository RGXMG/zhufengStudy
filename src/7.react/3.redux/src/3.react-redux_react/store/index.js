// import { createStore, bindActionCreators } from "../../lib/redux";
// import { createStore, applyMiddleware } from "redux";
import { createStore, applyMiddleware } from "../../lib/redux";
import thunk from "../../lib/redux-thunk";
import reduxPromise from "../../lib/redux-promise";

const ADD_ACTION = "add";
const REDUCE_ACTION = "reduce";

const action = {
  onAdd() {
    return { type: ADD_ACTION };
  },

  // NOTE 异步action，使用thunk中间件
  onAsyncAdd() {
    return dispatch => {
      setTimeout(() => {
        dispatch({ type: ADD_ACTION });
      }, 1000);
    };
  },

  // NOTE 采用promise的异步回调，action直接返回promise，使用redux-promise中间件
  onPromiseOfFnAdd() {
    return new Promise((res, rej) => {
      setTimeout(() => {
        res({ type: ADD_ACTION });
      }, 1000);
    });
  },

  // NOTE 采用promise的异步回调，action中的payload返回promise，使用redux-promise中间件
  onPromiseOfPayloadAdd() {
    return {
      type: ADD_ACTION,
      payload: new Promise((res, rej) => {
        setTimeout(() => {
          res(10);
        }, 1000);
      })
    };
  },

  onReduce() {
    return { type: REDUCE_ACTION };
  }
};

function reducer(state = { number: 0 }, { type, payload = 1 }) {
  switch (type) {
    case ADD_ACTION:
      return { number: state.number + payload };
    case REDUCE_ACTION:
      return { number: state.number - payload };
    default:
      return state;
  }
}
// const store = createStore(reducer);

const logger1 = store => dispatch => action => {
  console.log("旧值1：：：", store.getState());
  dispatch(action);
  console.log("新值1：：：", store.getState());
};
const logger2 = store => dispatch => action => {
  console.log("旧值2：：：", store.getState());
  dispatch(action);
  console.log("新值2：：：", store.getState());
};
const store = applyMiddleware(
  reduxPromise,
  thunk,
  logger1,
  logger2
)(createStore)(reducer);
export { action, store as default };
