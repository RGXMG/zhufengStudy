const merge = require("webpack-merge");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
// NOTE 该plugin会将根据打包的文件在dist目录下自动创建一个json配置文件，在进行ssr渲染的时候就可以通过该配置文件读取客户端文件的映射
const VueSsrRenderPlugin = require('vue-server-renderer/client-plugin');
const base = require("./webpack.base.js");
const clientPath = p => path.join(__dirname, "../client/", p);
module.exports = merge(base, {
  entry: {
    client: clientPath("./client-entry.js")
  },
  plugins: [
    new VueSsrRenderPlugin(),
    new HtmlWebpackPlugin({
      template: clientPath("./public/index.html"),
      filename: "index.html",
      title: "vue-client",
      hash: true,
      minify: {
        removeAttributeQuotes: true
      }
    })
  ]
});
