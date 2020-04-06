import createApp from "./main";

/**
 * NOTE  服务端的入口文件
 *  1. 该文件会导出一个自执行函数，然后将Vue的实例返回供ssr使用
 *  2. 使用webpack打包将该文件打包成commonjs规范文件
 *  @param context 为vue-server-renderer的renderToString方法的第一参数
 */
export default context => {
  return new Promise((res, rej) => {
    const { app, router, store } = createApp();

    // NOTE 每次执行该方法时，就会传入context.url属性，该属性为当前访问的path路径
    //  我们则可以在app实例完成之后，再通过router.push改变app中的路由，达到渲染具体path的目的
    if (context.url) {
      // 渲染该路由
      router.push(context.url);
    }
    // NOTE onReady方法的callback表示着当前path对应的components已经加载完毕
    //  针对component的一下处理我们需要在这个回调中完成
    router.onReady(() => {
      // NOTE 1.处理404
      if (!router.getMatchedComponents().length) {
        return rej(404);
      }

      // NOTE 2.处理组件中的asyncData方法
      //  将所有的组件的asyncData方法的返回值(很有可能是promise)保存，待所有方法都resolve掉时
      //  表示更改store数据完毕，我们需要将最新的store数据半保存在context.state中，
      const pros = router
        .getMatchedComponents()
        .map(i => Promise.resolve(i.asyncData ? i.asyncData(store) : null));
      Promise.all(pros)
        .then(() => {
          //  NOTE vue-server-renderer会自动帮我们把context.state绑定到window.__INITIAL_STATE__上，
          //   我们就可以在store文件中判断window上是否存在该数据，存在就需要调用store.replaceState替换
          context.state = store.state;
          res(app);
        })
        .catch(rej);
    }, rej);
  });
};
