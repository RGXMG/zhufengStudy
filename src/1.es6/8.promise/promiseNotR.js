let PromiseNotR = null;
(function(){
  const statusObject = {
    pending: 'pending',
    resolved: 'resolved',
    rejected: 'onReject',
  };
  let status = statusObject.pending;
  // 当前回调函数Array的索引
  // 包含resolve已经reject
  // 必须使用同一个索引
  let thenCallBackIndex = 0;
  // 成功回调方法
  const onResolvedCallBackArray = [];
  // 失败回调方法
  const onRejectedCallBackArray = [];
  // 最终的回调
  let onCatch = null;
  // 最终的finally
  let onFinally = null;
  // 返回值
  let  returnValues = undefined;
  const isPromise = function(likePromise) {
    return likePromise instanceof PromiseNotR
  };

  /**
   * 拨动拨片使其到达下一次then
   */
  const pickNextThen = () => {
    thenCallBackIndex ++;
  };
  /**
   * 处理rejected执行时出错的情况
   * @param e
   */
  const handleRejectedError = function(e) {
    // 出现异常
    // 保存异常值
    returnValues = e;
    // 索引+1
    // 也就是切换下一个then
    pickNextThen();
    handleRejected(e);
  };
  /**
   * 处理reject
   *
   */
  const handleRejected = function() {
    // 判断thenCallBackIndex < onRejectedCallBackArray.length是否不成立
    // 不成立 表示应该尝试直接调用onCatch方法
    if (thenCallBackIndex >= onRejectedCallBackArray.length) {
      // 存在onCatch
      if (typeof onCatch === 'function') {
        onCatch(returnValues);
        // 不存在 直接抛出内部不处理的Error供外部处理
      } else throw new Error(returnValues);
      return;
    }
    // 循环读取onRejectCallBack
    for (; thenCallBackIndex < onRejectedCallBackArray.length; thenCallBackIndex ++) {
      const callBack = onRejectedCallBackArray[thenCallBackIndex];
      try {
        // 存放的是function, 就调用
        // 并更新返回值
        if (typeof callBack === 'function') {
          returnValues = callBack(returnValues);
          // 是promise对象
          // 交出控制权
          if (isPromise(returnValues)) {
            promiseTakeControl(returnValues, handleResolved)
          }
          return;
        }
      } catch (e) {
        handleRejectedError(e);
      }
    }
  };
  /**
   * 处理执行resolved方法时出错的情况
   * @param e
   */
  const handleResolvedError = function(e) {
    // 保存抛出的错误
    returnValues = e;
    // 索引值 + 1，为了取得下一个then
    pickNextThen();
    // 执行处理reject
    handleRejected(e);
    // 处理完成之后，索引再次 + 1，得到下一个then
    pickNextThen();
    // 接着处理resolve
    handleResolved();
  };
  /**
   * 处理resolved
   * 跟处理reject原理大体相似
   * 每次循环执行为function的callBack
   * 如果得到异常，就走catch，执行下一个then的reject回调方法
   * 处理完异常，再接着执行handleResolved
   */
  const handleResolved = function() {
    for (; thenCallBackIndex < onResolvedCallBackArray.length; thenCallBackIndex ++) {
      const callBack = onResolvedCallBackArray[thenCallBackIndex];
      try {
        if (typeof callBack === 'function') {
          returnValues = callBack(returnValues);
          // 是promise对象
          // 交出控制权
          if (isPromise(returnValues)) {
            promiseTakeControl(returnValues, handleResolved);
            return;
          }
        }
      } catch (e) {
        handleResolvedError(e);
      }
    }
  };

  /**
   * 获取promise控制权限
   * 重写pro的resolver方法，在该pro执行res
   * @param pro
   * @param mission
   */
  const promiseTakeControl = function(pro, mission) {
      const overwriteFinally = () => {
        pickNextThen();
        mission();
      };
      if (pro.finally) {
        pro.finally = function() {
          pro.finally.call(pro);
          overwriteFinally();
        }
      }
      else pro.finally = overwriteFinally;
  };

  PromiseNotR = function(task) {
    const onResolved = (res) => {
      if (status === statusObject.pending) {
        status = statusObject.resolved;
        returnValues = res;
        handleResolved();
        if (typeof onFinally === 'function') {
          onFinally();
        }
      }
    };
    const onReject = (e) => {
      if (status === statusObject.pending) {
        status = statusObject.rejected;
        returnValues = e;
        handleRejected();
        thenCallBackIndex ++;
        handleResolved();
        if (typeof onFinally === 'function') {
          onFinally();
        }
      }
    };
    try {
      task(onResolved, onReject);
    } catch (e) {
      onReject(e);
    }
  };
  PromiseNotR.prototype.then = function(resCB, rejCB) {
    onResolvedCallBackArray.push(resCB);
    onRejectedCallBackArray.push(rejCB);
    return this;
  };
  PromiseNotR.prototype.catch = function(catchCB) {
    onCatch = catchCB;
    return this;
  };
  PromiseNotR.prototype.finally = function(finallyCB) {
    onFinally = finallyCB;
    return this;
  };
})();

window.Pro2 = PromiseNotR;