import Vue from "vue";
// import Vuex from "vuex";
import Vuex from "./lib";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    name: "XMG",
    age: 20
  },
  modules: {
    a: {
      modules: {
        c: {}
      },
      state: {}
    },
    b: {
      modules: {
        d: {}
      }
    }
  },
  getters: {
    getAge(state) {
      return state.age;
    }
  },
  mutations: {
    upAge(state, payload) {
      state.age += payload;
    }
  },
  actions: {
    asyncUpAge({ commit }, payload) {
      setTimeout(() => {
        commit("upAge", payload);
      }, 2000);
    }
  }
});
