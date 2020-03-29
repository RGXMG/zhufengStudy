import Vue from "vue";
// import Vuex from "vuex";
import Vuex from "./lib";

Vue.use(Vuex);

const logger = store => {
  store.subscribe(function(mutation) {
    console.log(mutation);
  });
};

export default new Vuex.Store({
  plugins: [logger],
  state: {
    name: "XMG",
    age: 20
  },
  modules: {
    a: {
      state: {},
      modules: {
        c: {
          state: {}
        }
      }
    },
    b: {
      state: {},
      modules: {
        d: {
          state: {}
        }
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
