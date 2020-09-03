/**
 * NOTE 在浏览器每一帧渲染的空闲的时候会执行该函数，
 *  https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestIdleCallback
 *  1. 浏览器在每一帧渲染结束后，如果还有剩余时间，则会尝试调用该ric传入的回调函数；
 *  2. 可以通过传入callback函数中的参数对象IdleDeadline获取当前还有多少剩余时间以及是否超过了timeOut时间；
 */
