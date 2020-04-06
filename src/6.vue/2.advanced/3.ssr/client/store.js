/**
 * NOTE ssr中的vuex
 *  如果想在服务端提前处理store中的数据，则可以在router匹配的组件中定义一个asyncData方法，
 *  约定在该方法中处理store中的数据(nuxt.js的约定)，普通的组件不会执行该方法
 */
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);
export default () => {
  return new Vuex.Store({
    state: {
      count: 0
    },
    mutations: {
      stateChange(state, payload) {
        console.log("stateChange:::", payload);
        for (const [k, v] of Object.entries(payload)) {
          state[k] = v;
        }
      }
    },
    actions: {
      add({ commit, state }) {
        return new Promise((res, rej) => {
          setTimeout(() => {
            console.log("actions:::", state.count);
            res(commit("stateChange", { count: state.count + 1 }));
          }, 2000);
        });
      }
    }
  });
};
