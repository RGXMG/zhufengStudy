
let callbacks = [];
function flushCallbacks(){
    callbacks.forEach(cb=>cb());
}
export function nextTick(cb){ // cb就是flushQueue
    callbacks.push(cb);
    // 要异步刷新这个callbacks ，获取一个异步的方法 
    //                          微任务                       宏任务
    // 异步是分执行顺序的 会先执行(promise  mutationObserver)  setImmediate  setTimeout 
    let timerFunc = ()=>{
        flushCallbacks();
    }
    if(Promise){ // then方法是异步的
        return Promise.resolve().then(timerFunc)
    }
    if(MutationObserver){ // MutationObserver 也是一个异步方法
        let observe = new MutationObserver(timerFunc); // H5的api
        let textNode = document.createTextNode(1);
        observe.observe(textNode,{characterData:true});
        textNode.textContent = 2;
        return
    }
    if(setImmediate){
        return setImmediate(timerFunc)
    }
    setTimeout(timerFunc, 0);
}