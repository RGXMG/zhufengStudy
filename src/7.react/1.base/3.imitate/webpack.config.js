const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve("dist"),
    filename: "index.bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              [
                "@babel/env",
                {
                  targets: "> 0.2%",
                  useBuiltIns: "usage",
                  corejs: "3"
                }
              ]
            ],
            plugins: [
              "@babel/plugin-proposal-class-properties",
              [
                "@babel/plugin-transform-runtime",
                {
                  corejs: "3"
                }
              ]
            ]
          }
        }
      }
    ]
  },
  devtool: "source-map",
  plugins: [
    new HtmlWebpackPlugin({
      template: "./index.html",
      filename: "index.html"
    })
  ]
};
