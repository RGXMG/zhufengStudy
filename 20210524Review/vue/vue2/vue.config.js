/**
 * Created with JavaScript.
 * User: rgxmg
 * Email: rgxmg@foxmail.com
 * Date: 2021/6/24
 * Time: 14:21
 *
 */

const assetsCDN = {
  css: [],
  js: [
    "//cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.min.js",
    "//cdn.jsdelivr.net/npm/vue-router@3.2.0/dist/vue-router.min.js",
    "//cdn.jsdelivr.net/npm/vuex@3.4.0/dist/vuex.min.js",
  ],
};

function isPro() {
  return process.env.NODE_ENV === "production";
}

const prodExternals = {
  vue: "Vue",
  "vue-router": "VueRouter",
  vuex: "Vuex",
};

module.exports = {
  configureWebpack(config) {
    // config.optimization.minimizer = [];
    // config.devtool = "none";
    isPro() && (config.externals = prodExternals);
  },
  chainWebpack(config) {
    config.plugin("html").tap((arg) => {
      isPro() && (arg[0].cdn = assetsCDN);
      return arg;
    });
  },
};
