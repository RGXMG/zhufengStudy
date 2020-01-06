/**
 * express和koa的不同点：
 * 1.express如果不调用res.end(),则进程不会结束，而koa当同步代码执行结束之后就结束进程(所以koa使用async/await将异步代码改为同步代码运行)
 * 2.express也可以进行洋葱模型，只是一般不会这么操作，而koa将异步代码改为了同步代码
 */
