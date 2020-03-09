const callbacks = [];
function flushCallbacks() {
  callbacks.forEach(cb => cb());
}

/**
 * nextTick函数
 * Vue中用于在视图更新之后的回调处理
 * 1. 采用微任务队列更新
 * 2. 兼容处理依次为Promise - 微任务、mutationObserve - 微任务、setImmediate(兼容性差) - 宏任务、setTimeout - 宏任务
 * @param cb
 */
function nextTick(cb) {
  callbacks.push(cb);
  const timerFunc = () => {
    flushCallbacks();
  };
  if (typeof Promise === "function") {
    Promise.resolve().then(timerFunc);
  } else if (typeof MutationObserver === "function") {
    const observe = new MutationObserver(timerFunc);
    const textNode = document.createTextNode("1");
    observe.observe(textNode, {
      characterData: true
    });
    textNode.textContent = "2";
  } else if (setImmediate) {
    setImmediate(timerFunc);
  } else if (setTimeout) {
    setTimeout(timerFunc, 0);
  }
}
export default nextTick;
