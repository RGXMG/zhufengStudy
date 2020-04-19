import {
  createStore,
  bindActionCreators,
  combineReducers
} from "../../lib/redux";
import { count1, count2 } from "./reducers";
import _actions from "./actions";

/**
 * NOTE 0 创建reducers集合
 *  该combineReducers操作会将所有的reducer保存为一个大的reducer，每个state改变的时候，
 *  该big reducer就会遍历所有的reducer，从而得到新的state；
 *  该combineReducers还会根据传入的reducer对象创建一个 big state, 类似于namespace，
 *  如传入下面的对象之后，最终的state为： { count1: any, count2: any }
 */
const reducersCollection = combineReducers({ count1, count2 });

// NOTE 1. 根据store创建store
const store = createStore(reducersCollection);

// NOTE 2. 使用bindActionCreator方法简化派发
const actions = bindActionCreators(_actions, store.dispatch);
export { actions, store as default };
