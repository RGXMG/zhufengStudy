import Vue from "vue";
import App from "./App";
import createRouter from "./router";
import createStore from "./store";

const router = createRouter();
const store = createStore();
const vm = new Vue({
  router,
  store,
  render: h => h(App)
});
export default function createApp() {
  // NOTE 将路由导出，外部根据router状态进行切换
  return { app: vm, store, router };
}

// NOTE  处理vue-server-renderer将context中的state注入
if (window.__INITIAL_STATE__) {
  store.replaceState(window.__INITIAL_STATE__);
}
