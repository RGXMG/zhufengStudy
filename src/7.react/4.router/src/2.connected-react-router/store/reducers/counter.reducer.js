import * as counter from "../actionTypes/counter.actionTypes";
export default function(state = { number: 0 }, { type }) {
  switch (type) {
    case counter.INCREMENT:
      return { number: state.number + 1 };
    case counter.DECREMENT:
      return { number: state.number - 1 };
    default:
      return state;
  }
}
