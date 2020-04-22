/**
 * NOTE redux-thunk 中间件
 *  1. 拦截action为函数的，然后把控制权交给action；
 *  2. action函数会再次发起一个异步的dispatch，这个时候action为一个纯对象;
 *  3. 就又会走中间件的流程，而此时thunk则不会拦截；
 *  4. 总结起来就是在执行一次dispatch(function)时，首先thunk会将其拦截，不调用接下来的中间件，然后执行action函数，将dispatch传递给它，等它再次调用dispatch(object)时，thunk则不会拦截，会直接调用接下来的中间件，这样就接上了上次还走完的执行的中间件流程；
 *  5. 所以需要将thunk放在中间件位置的第一个
 */
function createThunkMiddleware(withExtraArgument) {
  return ({ dispatch, getState }) => next => action => {
    if (typeof action === "function") {
      return action(dispatch, getState, withExtraArgument);
    }
    next(action);
  };
}

const thunk = createThunkMiddleware();

// 可以提供额外的参数，通过该方法创建，自己手动创建一个thunk时传入默认参数
// const thunk = thunk.withExtraArgument('默认参数');
thunk.withExtraArgument = createThunkMiddleware;

export default thunk;

// NOTE eg：
//  1. 定义一个action对象；
//  2. 假设已经使用redux.bindActionCreator包装并已经注册了中间件(thunk, logger)；
//  3. 调用add的执行顺序：
//   add()【返回{ type: "add", payload: 1 }】 => thunk()【action为纯对象，不拦截，调用next】
//   => logger()【调用next，此时next函数为store.dispatch】 => 值改变，done；；
//  4. 调用asyncAdd;
//   add()【返回函数】 => thunk()【action为函数，拦截，调用action({dispatch})】 => asyncAdd()【2秒之后调用dispatch({ type: 'add', payload: 1 })】
//   => thunk()【action为object，不拦截，调用next】 => logger()【调用next，此时next函数为store.dispatch】 => 值改变，done；；
function logger() {
  return store => next => action => {
    console.log("log");
    next();
  };
}
const action = {
  add() {
    return { type: "add", payload: 1 };
  },
  asyncAdd() {
    return ({ dispatch, getState }) => {
      setTimeout(() => {
        dispatch({ type: "add", payload: 1 });
      }, 2000);
    };
  }
};
