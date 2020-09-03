/**
 * NOTE redux-saga 就是一系列的generator
 *  1. 在创建redux store时，applyMiddleware中的saga中间件；
 *  2. saga中间件只有一个入口，即需要创建rootSaga，在这个rootSaga中组织所有的saga，并调用generator；
 *  3. 监听saga（yield takeEvery/take等），监听向仓库派发的动作的，监听到某些action就会通知worker去执行；
 *  4. worker saga真正干活的的saga
 *
 *  NOTE 常用的方法 yield [methods]
 *  all： 调用所有的generator函数，内部就是依靠co库实现；
 *  call/apply：调用一个函数，该函数必须返回promise，如yield call(APi.login);
 *  put: 发起一个action，用于执行reducers；
 *  takeEvery: 监听每次的动作发生,原理是依靠take， yield takeEvery(types.INCREMENT, increment);
 *  take: 只监听一次action，
 *  select: 查询最新的状态state
 *  fork：相当于(实际上是将方法放入一个新的generator)将方法放入一个新的子进程，主进程继续执行，不造成主进程阻塞，const task = yield fork(fn);
 *  cancel: 取消一个fork开启的task任务；
 *  cancelled 在generator中调用，验证当前的generator任务函数是否被取消掉了，yield cancelled
 *  race: 比较谁最先执行完毕，当一个任务完成，会自动取消其他任务
 *        yield race({ start: call(add), end: take({ type: 'stop' }) });
 *        这个例子就是俩个一起执行，start中的add函数会一直执行(因为add函数中存在while循环，一直不会返回)，直到end中监听到了stop就会结束
 *
 *  NOTE saga相对于thunk的优点
 *  1.
 */
