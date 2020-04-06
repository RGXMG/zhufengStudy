/**
 * NOTE 服务端的webpack配置，主要功能如下：
 *  1. 打包`server-entry.js`成`commonjs2`规范给node使用，该文件中包含创建的Vue实例，node拿到该实例后可以进行ssr渲染；
 *  2. 打包`index.ssr.html`文件，但是该文件不用entry的bundle，因为该文件用于ssr渲染时的template文件；
 */

const merge = require("webpack-merge");
const path = require("path");
// NOTE 该plugin会向dist目录下创建一个server端打包后的配置文件
const VueSsrRenderPlugin = require("vue-server-renderer/server-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const base = require("./webpack.base.js");
const clientPath = p => path.join(__dirname, "../client/", p);
module.exports = merge(base, {
  entry: {
    server: clientPath("./server-entry.js")
  },
  output: {
    // lib目标为commonjs2规范，该规范会将模块导出的内容使用module.exports接受
    libraryTarget: "commonjs2",
    filename: "[name].[contentHash:4].js",
    path: path.join(__dirname, "../dist")
  },
  // 打包的目标环境为node
  target: "node",
  plugins: [
    new VueSsrRenderPlugin(),
    new HtmlWebpackPlugin({
      template: clientPath("./public/index.ssr.html"),
      filename: "index.ssr.html",
      title: "vue-ssr",
      // 将当前的入口导出文件排除
      excludeChunks: ["server"],
      hash: true,
      minify: {
        removeAttributeQuotes: true
      }
    })
  ]
});
