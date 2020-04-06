/**
 * NOTE ssr中的路由
 *  ssr中的路由通过手动调用router.push进行匹配，
 *  然后异步组件通过router.onReady方法进行处理
 *
 */
import Vue from "vue";
import VueRouter from "vue-router";
import Home from "./pages/home";
import User from "./pages/user";
Vue.use(VueRouter);
// 导出一个函数，供外部调用生成一次路由
export default () => {
  return new VueRouter({
    mode: "history",
    routes: [
      {
        path: "/",
        component: Home
      },
      {
        path: "/home",
        component: Home
      },
      {
        path: "/user",
        component: User
      }
    ]
  });
};
