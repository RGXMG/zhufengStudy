/**
 * NOTE 原生的redux
 *  1. redux库跟react没有直接关系，redux可以直接使用
 */
// import redux, { createStore } from "redux";
import createStore from "../lib/redux/createStore";

// NOTE 1. 建立一个初始化的state
const INITIAL_STATE = 0;

// NOTE 2. 建立reducer
const ADD_ACTION = "add";
const REDUCE_ACTION = "reduce";
function reducer(state = INITIAL_STATE, { type }) {
  switch (type) {
    case ADD_ACTION:
      return state + 1;
    case REDUCE_ACTION:
      return state - 1;
    default:
      return state;
  }
}

// NOTE 3. 建立store，也可以将INITIAL_STATE传入为第二参数
const store = createStore(reducer);

// NOTE 4. 获取state
const getState = () => store.getState();

// NOTE 5. 订阅变化
const unsubscribe = store.subscribe(render);
// setTimeout(unsubscribe, 3000);

function render() {
  content.innerHTML = getState();
}

const content = document.getElementById("render");
const add = document.getElementById("add");
const reduce = document.getElementById("reduce");
add.addEventListener("click", () => {
  store.dispatch({ type: ADD_ACTION });
});
reduce.addEventListener("click", () => {
  store.dispatch({ type: REDUCE_ACTION });
});

render();
