/**
 * NOTE 该纯函数用于合并reducer，不论是哪个reducer中的state应该改变，都会遍历执行所有的reducer，即纯函数执行
 *  1. 会遍历传入的reducer对象，然后根据key值在state中创建一个同名的值，也即namespace
 *  2. 该函数返回一个function给createStore，也就相当于一个reducer
 * @param reducers {Object<Function>} eg: { count: function, count2: function }
 */
export default function combineReducers(reducers) {
  // NOTE 返回的这个函数会像一个普通的reducer一样接受俩个参数
  //  state, action
  //  因为使用了combineReducers，最后的state肯定是一个对象
  return function(state = {}, action) {
    const reducersKeys = Object.keys(reducers);
    const newState = {};
    reducersKeys.forEach(key => {
      // NOTE 定义reducers对象时，会根据该对象的key在state创建一个同名[key]的值
      //  所以在创建和更新时都可以根据key值找出reducer对应的preState
      newState[key] = reducers[key](state[key], action);
    });
    return newState;
  };
}
