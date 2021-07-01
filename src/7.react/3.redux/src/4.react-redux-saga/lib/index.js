/**
 * NOTE 原理：
 *   1. 将generator使用类似于co库原理处理，然后take等方法使用发布订阅的方式进行监听
 *   2. 通过createSagaMiddleware方法创建一个中间件，然后执行run(rootSaga)方法
 */
/**
 * 创建一个通道，返回一个subscribe和publish方法
 * subscribe可以进行订阅action及callback，publish进行发布action和执callback
 */
function createChannel() {
  let observer = {};

  /**
   * 订阅方法
   * @param actionType
   * @param callback 其实就是co方法中的next函数，用来执行generator的下一次迭代
   */
  function subscribe(actionType, callback) {
    observer[actionType] = observer[actionType]
      ? observer[actionType].concat(callback)
      : [callback];
  }

  /**
   * 根据action来检测是否订阅了相关callback
   * 如果订阅就执行，然后进行delete，也就是只能执行监听一次，也就是take的处理方式
   * 需要监听多次，在effects中写成：while(true) { yield take(action) }
   * @param action
   */
  function publish(action) {
    if (action && action.type && observer[action.type]) {
      // NOTE 【错误】先执行，再删除
      //   因为可能存在循环take情况，执行之后，已经take了，再删除，就把最新的take删除掉了
      // observer[action.type](action);
      // delete observer[action.type];

      // NOTE 【正确】先删除，在执行
      let nextArray = observer[action.type];
      delete observer[action.type];
      nextArray.forEach((next) => next(action));
    }
  }
  return { subscribe, publish };
}

const channel = createChannel();
/**
 * 该方法需要返回一个redux中间件
 */
function createSagaMiddleware() {
  function middleware({ dispatch, getState }) {
    return (next) => (action) => {
      // 直接尝试发布该action，如果存在，则会自动执行callback
      channel.publish(action);
      next(action);
    };
  }
  // 添加一个run方法，用来执行rootSaga
  middleware.run = function (generator) {
    let ltr = generator();
    function next(action) {
      const { value, done } = ltr.next(action);
      if (value && value.type) {
        switch (value.type) {
          case "TAKE":
            // NOTE 为take监听，就订阅该action，并且将next函数作为callback传递给subscribe
            channel.subscribe(value.actionType, next);
            break;
          case "PUT":
            dispatch(value.action);
            next();
            break;
          case "CALL":
            value.action();
            next();
            break;
          default:
        }
      }
    }
    next();
  };
  return middleware;
}

// 使用redux-sage中间件
// import { createStore, applyMiddleware } from 'redux'
// import createSagaMiddleware from 'redux-saga'
//
// import reducer from './reducers'
// import mySaga from './sagas'
//
// // create the saga middleware
// const sagaMiddleware = createSagaMiddleware()
// // mount it on the Store
// const store = createStore(
//   reducer,
//   applyMiddleware(sagaMiddleware)
// )
//
// // then run the saga
// sagaMiddleware.run(mySaga)
//
// // render the application

// 使用
// import { takeEvery } from 'redux-saga/effects'
//
// // FETCH_USERS
// function* fetchUsers(action) { ... }
//
// // CREATE_USER
// function* createUser(action) { ... }
//
// // 同时使用它们
// export default function* rootSaga() {
//   yield takeEvery('FETCH_USERS', fetchUsers)
//   yield takeEvery('CREATE_USER', createUser)
// }
