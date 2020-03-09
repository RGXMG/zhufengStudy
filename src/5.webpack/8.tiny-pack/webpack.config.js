const path = require("path");
const ClearWebpackPlugin = require("./plugins/clear-webpack-plugin");
module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js"
  },
  resolveLoader: {
    modules: ["loaders", "node_modules"]
  },
  module: {
    rules: [
      {
        test: /.less$/,
        loader: 'style-loader!less-loader'
      }
    ],
  },
  plugins: [new ClearWebpackPlugin()]
};
