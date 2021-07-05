import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import Home from "./views/Home";
import { a } from "./utils";
import "./utils/Menu";
// import store from "./store";

Vue.config.productionTip = false;

Vue.component("Home", Home);
new Vue({
  router,
  // store,
  render: (h) => h(App),
}).$mount("#app");
console.log(a(222));
